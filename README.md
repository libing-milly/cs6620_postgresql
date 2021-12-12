# PostgreSQL as a (containerized) service


## Vision and Goals Of The Project:

PostgreSQL is an object-relational database system that is robust and reliable. The vision of this project is to build a fault-tolerant, containerized PostgreSQL as a service solution.

The key goals of this project include:
 
* Building various APIs that can create, delete and modify PostgreSQL databases that are stored on various containers. 
* Developing websites for the users to easily monitor and manage their databases through the APIs we built. 
* Developing websites for the system administrator to manage and view the meta-data of the PostgreSQL instances. 

## Users/Personas Of The Project:

There are 2 types of user roles of this project: the user of the databases, and the system administrator. 

| Database Users | System Administrator |
|----------------|----------------------|
| 1. As a database user, I want to store my data on a remote server that is fault tolerant, so that it is easy to scale up and down, and if one server is down, my data will not be lost.| 1. As a system administrator, I want to be able to create or delete a PGSQL instance if I need to.|
| 2. As a database user, I want to be able to conveniently manage my database through a website, including: changing my password, changing the capacity of a database, deleting a database etc. | 2. As a system administrator, I want to be able to read the real-time usage of all the PGSQL instances on the virtual machines, so that I can have a better understanding of the utilization of all the PGSQL instances.|
| 3. As a database user, I want to be able to monitor my database usage and conveniently have a report generated for me about the various metrics of my databases. | 3. As a system administrator, I want to be able to conveniently view the statistics or meta data of the PGSQL instances in the system.|


## Scope and Features Of The Project:

The project covers the build and deployment of a Web Application with an API implementation using which the user will be able to create PostgreSQL instances on different VMs and spin-up new databases as required. The below features can be considered as in scope for the project implementation:

* Create a Web-Application that the user will be able to interact with and perform various operations.
* Creation of various APIs for the purpose of :
* Creation of new databases on the existing PostgreSQL instances. This should also create a backup database that shadows the primary database on another PostgreSQL instance.
* Delete existing PostgreSQL database instances
* List existing PostgreSQL instances.
* Get PostgreSQL instance information.
* Change a PostgreSQL Instance's Settings.
* List databases running on a specific PostgreSQL instance.
* Get information about a PostgreSQL database.
* Create a database on an existing instance.
* Change settings of an existing database. 
* Change parameters of the existing databases
* Generate reporting metrics regarding the resource utilization, database health and database usage.

Stretch Goals (to be implemented if time permits)

* Expand the API service to function across multiple clouds (e.g. a private OpenStack cloud and Google Cloud)
* Build a service that can run PostgreSQL VM instances as well as container instances. 


## Solution Concept:

The system will consist of a Web Application that will be used by the user and the corresponding API logic layer will be responsible for creating the database instances as well as getting the data requested by the user. Initially, the entire project will be done on an OpenStack based Cloud and then later can be expanded to accommodate other private clouds. The technology stack that will be used for implementation has not yet been finalized, however, we envision the final structure to be as given below.

![alt text][figure 1]

[figure 1]: https://github.com/libing-milly/cs6620_postgresql/blob/main/diagram.png "Logo Title Text 2"

Figure 1 presents the conceptual design we have for PGSQL as a Service (PGSQLaaS) system. In the figure, the Web service and API solution we will build is running at the bottom two boxes and the upper side of the picture represents the PGSQL instances that are hosting the user databases. As an example, the primary DB1 database (DB1-P) lives on VM1 and a secondary replica of DB1 lives on VM2 (DB1-S). This way, if the VM1 goes down the DB1 data is still available in the PGSQL instance running on VM2. Users of PGSQLaaS interact with it either via the Web interfaces served from the Apache web servers or via API’s exposed on API VM1 and API VM2.



## Acceptance criteria:
*  Our web application supports basic functions such as creating, deleting, listing, and updating a PostgreSQL and existing database, for both the database user and the system administrator.

## Release Planning:

We will attempt to deliver our project in the following stages:

1. A simple website and the corresponding APIs for the user to create and delete a PostgreSQL database on a container.
2. A more comprehensive website with functions including viewing the meta information on current databases, updating the parameters of databases.
3. A website and the corresponding APIs for the system administrator to monitor the state of the PostgreSQL instances.
The stretch goals if time permits.


## Developer Guide:

There are 4 components in this project, the frontend, the backend server, the central repository and the configuration of postgres server. In the following sections we will explain the steps needed to configure and run each component.

### Configuration of postgres server

First step of running this project is to set up the primary and secondary postgres servers on two different VMs:

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

`# Accept from anywhere (not recommended)

host all all 0.0.0.0/0 md5`

`# Accept from trusted subnet (Recommended setting)

host all all 192.168.18.0/24 md5`

Restart postgresql

`sudo systemctl restart postgresql-13`

#### Step 5: Install repmgr on both servers

`yum -y  install repmgr13*`

#### Step 6: Re-configure on primary server

`sudo vi /var/lib/pgsql/13/data/postgresql.conf`

Edit these parameters

`listen_addresses = '*' `

`max_wal_senders = 10`

`max_replication_slots = 10`

`wal_level = 'replica'`

`hot_standby = on`

`archive_mode = on`

`archive_command = '/bin/true'`

`shared_preload_libraries = 'repmgr'`

#### Step 7: Create super users on primary server's Postgresql

`$ createuser --superuser repmgr`

`$ createdb --owner=repmgr repmgr`

#### Step 8: Re-configure pg_hba.conf on primary server

`$ sudo vi /var/lib/pgsql/13/data/pg_hba.conf`, 

`local   replication     repmgr                              trust

host    replication     repmgr      127.0.0.1/32            trust

host    replication     repmgr      16.0.0.0/16             trust

local   repmgr          repmgr                              trust

host    repmgr          repmgr      127.0.0.1/32            trust

host    repmgr          repmgr      16.0.0.0/16             trust`

### Backend Server and Central Repository

Please see the code and set up instructions of the backend server and the central repository in(https://github.com/amadgi/postgres_server)

### Running Frontend Locally

To run the frontend locally, Create a file named `.env` in the root directory with the line `REACT_APP_API_BASE=`, followed with the address of where your server is deployed, for example `REACT_APP_API_BASE='http://localhost:8080'`.
After the `.env` file is created, run the `npm start` command(you will need to run the `npm install` the very first time). Moments later, a browser will automatically open with the frontend running on it.
