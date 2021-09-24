# cs6620_postgresql
PostgreSQL as a (containerized) service


Vision and Goals Of The Project:

PostgreSQL is an object-relational database system that is robust and reliable. It’s reliable by having a shadow table for each table provisioned. The vision of this project is to build a fault-tolerant, containerized PostgreSQL as a service solution. 

The key goals of this project include: 
Building various APIs that can create, delete and modify PostgreSQL databases that are stored on various containers. 
Developing websites for the users to easily monitor and manage their databases through the APIs we built. 
Developing websites for the system administrator to manage and view the meta-data of the PostgreSQL instances. 

Users/Personas Of The Project:

There are 2 types of user roles of this project: the user of the databases, and the system administrator. 

User Story of Database Users
1. As a database user , I want to store my data on a remote server that is fault tolerant, so that it is easy to scale up and down, and if one server is down, my data will not be lost.
2. As a database user, I want to be able to conveniently manage my database through a website, including: changing my password, changing the capacity of a database, deleting a database etc.
3. As a database user, I want to be able to monitor my database usage and conveniently have a report generated for me about the various metrics of my databases.

User Story of System Administrator
1.As a system administrator, I want to be able to create or delete a PGSQL instance if I need to.
2. As a system administrator, I want to be able to read the real-time usage of all the PGSQL instances on the virtual machines, so that I can have a better understanding of the utilization of all the PGSQL instances.
3. As a system administrator, I want to be able to conveniently view the statistics or meta data of the PGSQL instances in the system.



Scope and Features Of The Project:
The project covers the build and deployment of a Web Application with an API implementation using which the user will be able to create PostgreSQL instances on different VMs and spin-up new databases as required. The below features can be considered as in scope for the project implementation:
Create a Web-Application that the user will be able to interact with and perform various operations.
Creation of various APIs for the purpose of :
Creation of new databases on the existing PostgreSQL instances. This should also create a backup database that shadows the primary database on another PostgreSQL instance.
Delete existing PostgreSQL database instances
List existing PostgreSQL instances.
Get PostgreSQL instance information.
Change a PostgreSQL Instance's Settings.
List databases running on a specific PostgreSQL instance.
Get information about a PostgreSQL database.
Create a database on an existing instance.
Change settings of an existing database. 
Change parameters of the existing databases
Generate reporting metrics regarding the resource utilization, database health and database usage.

Stretch Goals (to be implemented if time permits)
Expand the API service to function across multiple clouds (e.g. a private OpenStack cloud and Google Cloud)
Build a service that can run PostgreSQL VM instances as well as container instances. 


Solution Concept
The system will consist of a Web Application that will be used by the user and the corresponding API logic layer will be responsible for creating the database instances as well as getting the data requested by the user. Initially, the entire project will be done on an OpenStack based Cloud and then later can be expanded to accommodate other private clouds. The technology stack that will be used for implementation has not yet been finalised, however, we envision the final structure to be as given below.




Acceptance criteria


Release Planning:


Resources Needed:
We will be testing and deploying our application on the MassOpen Cloud and hence we would be requiring these accesses to start with our development. If we decide to carry out our stretch assignment, then we would also need access to the private cloud.

