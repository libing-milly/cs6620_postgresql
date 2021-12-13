# PostgreSQL as a service


## Vision and Goals Of The Project:

PostgreSQL is an object-relational database system that is robust and reliable. The vision of this project is to build a fault-tolerant PostgreSQL as a service solution.

The key goals of this project include:
 
* Building various APIs that can create, delete and modify PostgreSQL databases that are stored on various containers. 
* Developing websites for the users to easily monitor and manage their databases through the APIs we built. 

## Users/Personas Of The Project:

Database Users

1. As a database user, I want to store my data on a remote server that is fault tolerant, so that it is easy to scale up and down, and if one server is down, my data will not be lost.

2. As a database user, I want to be able to conveniently manage my database through a website, including: create a new database, requesting access to existing database and deleting a database etc. 

3. As a database user, I want to be able to monitor my database usage and conveniently have a report generated for me about the various metrics of my databases.


## Scope and Features Of The Project:

The project covers the build and deployment of a Web Application with an API implementation using which the user will be able to create PostgreSQL instances on different VMs and spin-up new databases as required. The below features can be considered as in scope for the project implementation:

- Create a Web-Application that the user will be able to interact with and perform various operations.
- Creation of various APIs for the purpose of :
 - Creation of new databases on the existing PostgreSQL instances. This should also create a backup database that shadows the primary database on another PostgreSQL instance.
 - Delete existing PostgreSQL database.
 - Get information about a PostgreSQL database.
 - Change settings of an existing database. 
 - Generate reporting metrics regarding the database health and database usage.

Stretch Goals: 
* Provide Client Authentication over SSL.
* Expand the API service to function across multiple clouds (e.g. a private OpenStack cloud and Google Cloud).


## Solution Concept:

The system will consist of a Web Application that will be used by the user and the corresponding API logic layer will be responsible for creating the database instances as well as getting the data requested by the user. Initially, the entire project will be done on an OpenStack based Cloud and then later can be expanded to accommodate other private clouds. 

### Technology Used
The technology stack that we used for implementation are as follows:
* Frontend: React.js
* Backend: Flask
* PostgreSQL Database Adapter: Psycopg
* Auto Postgres Fail Over Management Tool: Repmgr, Keepalived
* API Testing: Swagger API


### Design
We envision the final structure to be as given below.

![alt text][figure 1]

[figure 1]: https://github.com/libing-milly/cs6620_postgresql/blob/main/diagram_final.png "Logo Title Text 2"

The above diagram presents the conceptual design we have for PGSQL as a Service (PGSQLaaS) system. There are mainly 4 componenets: 
* the React web application; 
* the Backend Server that handles database CRUD operation; 
* the Central Lookup Repository that maintains information needed to connect to a Postgres Server; 
* the Postgres Servers along with a poller script for updating server information to the Central Lookup Server.

The user can either calls the APIs directly or through the web application we developed. When a user trigger an API call through the web application, the web application will call the backend server through API. 

The Backend Server and Central Lookup Repository are are hosted on one VM. This VM is used only for the purpose of hosting this server. When the backend server receives a request, it will check the central lookup repository for information needed to connect to the correct postgres server, including the ip address, whether the postgres server is primary or sandby, and its availability. When the backend server found the information needed, it will then connect to the appropriate postgres server and sends appropriate commmands as requested. 

The Postgres Servers are always created in pairs on 2 separate VMs, with one being parimary and the other being the standby. When a postgres server receives a command from the backend server, the command will be automatically replicated to its standby server. On every VM that runs a postgres server, there is also a poller script that will call the Central Lookup API on a schedule to update the postgres server's inforamtion to the Central Lookup Repository. In the scenario when the primary postgres server fails, the standby postgres server will automatically become the primary, and the poller script will update this information to the Central Lookup Repository. 


## Acceptance criteria:
*  Our web application supports basic functions such as creating, deleting and updating a Postgres database, in a fault-tolerent mannner.

## Release Planning:

We will attempt to deliver our project in the following stages:

1. A simple website and the corresponding APIs for the user to create and delete a PostgreSQL database on a container.
2. A more comprehensive website with functions including viewing the meta information on current databases, updating the parameters of databases.
The stretch goals if time permits.


## Developer Guide:

In the following sections we will explain the steps needed to set up each of the 4 main components of this project in order:

1. the configuration of postgres server (for auto replication and failover)
2. the backend server
3. the central repository and the poller script 
4. the web interface

### Configuration of postgres server

First step of setting up this project is to install and configure the primary and standby postgres servers on two different VMs (We are using Centos 8 OS and PostgreSQL version 13):
1. Step 1 - 4 go through the installation of Postgres server
2. Step 5 -14 go through the configuration of auto repliaction and failover. 
3. Configuration of keepalived 

#### Step 1: Install PostgreSQL 13 on CentOS 8 on both servers

`sudo dnf install https://download.postgresql.org/pub/repos/yum/reporpms/EL-8-x86_64/pgdg-redhat-repo-latest.noarch.rpm`

`sudo dnf -qy module disable postgresql`

`$ sudo dnf repolist`

`$ sudo yum search postgresql13`

`sudo dnf install postgresql13 postgresql13-server`

#### Step 2: Initialize and start database service on both servers

`$ sudo /usr/pgsql-13/bin/postgresql-13-setup initdb`

`$ sudo systemctl enable --now postgresql-13`

#### Step 3: Set PostgreSQL admin user’s password on both servers

`$ sudo su - postgres `

`$ psql -c "alter user postgres with password 'postgres'"`

#### Step 4: Enabling remote Database connections on both servers

Edit the postgresql.conf：

`$ sudo vi /var/lib/pgsql/13/data/postgresql.conf`

Change the `listen_addresses = '*'`

Edit the pg_hba.conf:

`$ sudo vi /var/lib/pgsql/13/data/pg_hba.conf`, 

Add:
```
# Accept from anywhere (not recommended)

host all all 0.0.0.0/0 md5

# Accept from trusted subnet (Recommended setting)

host all all 192.168.18.0/24 md5
```
Restart postgresql

`sudo systemctl restart postgresql-13`

#### Step 5: Install repmgr on both servers

`yum -y  install repmgr13*`

#### Step 6: Re-configure on primary server

`sudo vi /var/lib/pgsql/13/data/postgresql.conf`

Edit these parameters

```
listen_addresses = '*' 

max_wal_senders = 10

max_replication_slots = 10

wal_level = 'replica'

hot_standby = on

archive_mode = on

archive_command = '/bin/true'

shared_preload_libraries = 'repmgr'
```

#### Step 7: Create super users on primary server's Postgresql

`$ createuser --superuser repmgr`

`$ createdb --owner=repmgr repmgr`

#### Step 8: Re-configure pg_hba.conf on primary server

`$ sudo vi /var/lib/pgsql/13/data/pg_hba.conf`, 

Add these lines above the regular setting:

```
local   replication     repmgr                              trust

host    replication     repmgr      127.0.0.1/32            trust

host    replication     repmgr      10.0.0.0/16             trust

local   repmgr          repmgr                              trust

host    repmgr          repmgr      127.0.0.1/32            trust

host    repmgr          repmgr      10.0.0.0/16             trust
```
#### Step 9: Re-configure pg_hba.conf on primary server

`$ sudo vi /var/lib/pgsql/repmgr.conf`

```
cluster='failovertest'

node_id=1

node_name=node1

conninfo='host=10.0.0.220 user=repmgr dbname=repmgr connect_timeout=2'

data_directory='/var/lib/pgsql/13/data/'

failover=automatic

promote_command='/usr/pgsql-13/bin/repmgr standby promote -f /var/lib/pgsql/repmgr.conf --log-to-file'

follow_command='/usr/pgsql-13/bin/repmgr standby follow -f /var/lib/pgsql/repmgr.conf --log-to-file --upstream-node-id=%n'
```

#### Step 10: Register the primary server and check status

`/usr/pgsql-13/bin/repmgr -f /var/lib/pgsql/repmgr.conf primary register`

Check our primary servers status:

`/usr/pgsql-13/bin/repmgr -f /var/lib/pgsql/repmgr.conf cluster show`

Restart the Postgresql service 

`# systemctl restart postgresql-13.service`

#### Step 11: Build/clone the standby server on standby server

`$ sudo vi /var/lib/pgsql/repmgr.conf`

```
node_id=2

node_name=node2

conninfo='host=10.0.0.17 user=repmgr dbname=repmgr connect_timeout=2'

data_directory='/var/lib/pgsql/13/data'

failover=automatic

promote_command='/usr/pgsql-13/bin/repmgr standby promote -f /var/lib/pgsql/repmgr.conf --log-to-file'

follow_command='/usr/pgsql-13/bin/repmgr standby follow -f /var/lib/pgsql/repmgr.conf --log-to-file --upstream-node-id=%n'
```

Clone the standby server from our primary server: (Or have a `--dry-run` to check if we met requirements)

`/usr/pgsql-13/bin/repmgr -h 10.0.0.220 -U repmgr -d repmgr -f /var/lib/pgsql/repmgr.conf standby clone`

#### Step 12: Register the standby server and check status

`# systemctl start postgresql-13.service`

`# systemctl enable postgresql-13.service`

`/usr/pgsql-13/bin/repmgr -f /var/lib/pgsql/repmgr.conf standby register`

Check our primary and standby servers status:

`/usr/pgsql-13/bin/repmgr -f /var/lib/pgsql/repmgr.conf cluster show`

#### Step 13: Start repmgrd daemon process on both servers

`/usr/pgsql-13/bin/repmgr  -f /var/lib/pgsql/repmgr.conf daemon start`

Check cluster events:

`/usr/pgsql-13/bin/repmgr -f /var/lib/pgsql/repmgr.conf cluster event --event=repmgrd_start`

#### Step 14: Simulating a Failed Primary (Optional: it will need more opertaions to convert the failed primary back online as a healthy primary server)

`# systemctl stop postgresql-13.service`

Check the failing primary server status and our standby server is running as a primary server now:

`/usr/pgsql-13/bin/repmgr -f /var/lib/pgsql/repmgr.conf cluster show`

`/usr/pgsql-13/bin/repmgr -f /var/lib/pgsql/repmgr.conf cluster event`

To check more informantion on the document of repmgr(https://repmgr.org/docs/current/index.html)


### Configuration of Keepalived

* So far we have done the setting of primary and standby servers configuration now. But we have to set up the Keepalived's configuration for failing-over an IP address from one machine to another before we move to the next stage. Here are steps for configurating the Keepalived:

#### Step 1: yum install -y keepalived on both servers

`# yum install keepalived`

#### Step 2: Configurate keepalived on primary server

`$ sudo vi /etc/keepalived/keepalived.conf`

Modify these parameters:

```
vrrp_script keepalived_check {

      script "/usr/local/bin/keepalived_check.sh"
      
      interval 1
      
      timeout 5
      
      rise 3
      
      fall 3
}
```
```
vrrp_instance VI_1 {

      state MASTER
      
      interface eth0
      
      virtual_router_id 51
      
      priority 101
      
      advert_int 1
      
      authentication {
      
         auth_type PASS
         
         auth_pass 12345
      }
      virtual_ipaddress {
      
         10.0.0.100
      }
      track_process {
      
         keepalived_check
      }
}
```

#### Step 3: Configurate keepalived on standby server

```
vrrp_script keepalived_check {

      script "/usr/local/bin/keepalived_check.sh"
      
      interval 1
      
      timeout 5
      
      rise 3
      
      fall 3
}
```
```
vrrp_instance VI_1 {

    state BACKUP
    
    interface eth0
    
    virtual_router_id 51
    
    priority 100
    
    advert_int 1
    
    authentication {
    
        auth_type PASS
        
        auth_pass 1111
    }
    virtual_ipaddress {
    
        10.0.0.100
    }
    track_process {
    
         keepalived_check
      }
}
```

#### Step 4: Check IP address on both servers

`ip -brief address show`

### Backend Server, Central Repository and Poller Scipt

Please see the code and set up instructions of the backend server, the central repository and the poller script via(https://github.com/amadgi/postgres_server)

### Frontend 

An example of the deployed frontend can be accessed through (http://postgresql-as-a-service.herokuapp.com/)

#### Running Frontend Locally

To run the frontend locally, Create a file named `.env` in the root directory with the line `REACT_APP_API_BASE=`, followed with the address of where your server is deployed, for example `REACT_APP_API_BASE='http://localhost:8080'`.
After the `.env` file is created, run the `npm start` command(you will need to run the `npm install` the very first time). Moments later, a browser will automatically open with the frontend running on it.


