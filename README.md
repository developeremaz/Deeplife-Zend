zf2-angularjs-skeleton
======================

A skeleton app for the Zend Framework 2 and AngularJS.

This app uses the Zend Framework 2 as the backend to route/login/provide data to the frontend which runs on AngularJS.


Getting started
===============

First off, this project uses puphpet to create a vagrant machine. This means that you need to get the machine running.

    vagrant up

You can look into the *puphpet* directory for configuration files for puphpet. For example, you might want to rename the specified vhost if you use this skeleton as a base for another project:

    vhosts:
        OPHhGx2zl3DL:
            servername: skeleton.dev
            serveraliases:
                - www.skeleton.dev
            docroot: /var/www/public

Or even change the forwarded ports from the virtual machine:

    network:
        private_network: 192.168.56.101
        forwarded_port:
            KgfbYah64y0E:
                host: '5271'
                guest: '22'
            J1S41CprJmha:
                host: '8080'
                guest: '80'

You might also want to change the database name or user credentials:

    mysql:
    install: '1'
    root_password: '123'
    adminer: 0
    databases:
        UG5V5tUhCoM4:
            grant:
                - ALL
            name: skeleton
            host: localhost
            user: dbuser
            password: '123'
            sql_file: ''

As you can see, you can use different setups for different projects. Apache or nginx, postgres or mysql, the list goes on!

Like every project using Zend Framework 2 (zf2), you must still get the necessary libraries to have your base working.

    vagrant ssh
    cd /vagrant
    php composer.phar install

Once you have the required lib for zf2, now is time to generate the default database schema. First off, you need to setup the database in zf2.

To do this, add a file *local.php* in the autoload subdirectory of the config root directory.

    <?php
    /* /config/autoload/local.php */
    return array(
        'doctrine' => array(
            'connection' => array(
                'orm_default' => array(
                    'driverClass' => 'Doctrine\DBAL\Driver\PDOMySql\Driver',
                    'params' => array(
                        'host'     => 'localhost',
                        'port'     => '8889',
                        'user'     => 'dbuser',
                        'password' => '123',
                        'dbname'   => 'skeleton',
                    ),
                ),
            ),
        ),
    );

Once this is done, you can generate the schema using Doctrine :

    ./vendor/bin/doctrine-module orm:schema-tool:create

The last step of the configuration is to get the necessary dependencies using node package manager and bower :

    npm install && bower install

This should install the required dependencies, then you can run grunt to generate the css and js files :

    grunt

Now you should see a login page. If you just created the database, you won't be able to login since you don't have any user. Run the startup SQL script :

    mysql -u dbuser --password=123 skeleton < data/db/start.sql

Don't forget to add the specified dns record to your host file to be able to access the web page:

    127.0.0.1   skeleton.dev

That should do the trick to get up and running. You should now be able to access http://skeleton.dev:8080 and login with the user *admin@osedea.com* using password *q1w2e3r4*.
