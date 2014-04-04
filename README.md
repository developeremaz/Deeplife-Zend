zf2-angularjs-skeleton
======================

A skeleton app for the Zend Framework 2 and AngularJS.

This app uses the Zend Framework 2 as the backend to route/login/provide data to the frontend which runs on AngularJS.


Getting started
===============

Like every project using Zend Framework 2 (zf2), you must get the necessary libraries to have your base working.

    php composer.phar install

Once you have the required lib for zf2, now is time to generate the default database schema. First off, you need to setup the database in zf2.

To do this, add a file *local.php* in the autoload subdirectory of the config root directory.

    /* /config/autoload/local.php */
    return array(
        'doctrine' => array(
            'connection' => array(
                'orm_default' => array(
                    'driverClass' => 'Doctrine\DBAL\Driver\PDOMySql\Driver',
                    'params' => array(
                        'host'     => 'localhost',
                        'port'     => '3306',
                        'user'     => 'someuser',
                        'password' => 'somepassword',
                        'dbname'   => 'skeleton',
                    ),
                ),
            ),
        ),
    );

If you didn't already create the database, do it now :

    mysqladmin -u someuser --password=somepassword create skeleton

Once this is done, you can generate the schema using Doctrine :

    ./vendor/bin/doctrine-module orm:schema-tool:create

The last step of the configuration is to get the necessary dependencies using node package manager and bower :

    npm install && bower install

This should install the required dependencies, then you can run grunt to generate the css and js files :

    grunt

Now you should see a login page. If you just created the database, you won't be able to login since you don't have any user. Run the startup SQL script :

    mysql -u someuser --password=somepassword skeleton < data/db/start.sql

That should do the trick to get up and running. You should now be able to login with the user *admin@osedea.com* using password *q1w2e3r4*.
