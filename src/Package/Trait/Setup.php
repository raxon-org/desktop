<?php
namespace Package\Raxon\Desktop\Trait;

use Package\Raxon\Basic\Trait\Install;
use Raxon\App;
use Raxon\Config;
use Raxon\Exception\DirectoryCreateException;
use Raxon\Module\Cli;
use Raxon\Module\Data;
use Raxon\Module\Dir;
use Raxon\Module\Core;
use Raxon\Module\File;
use Raxon\Parse\Module\Parse;

use Exception;

trait Setup {
    const NAME = 'Desktop';

    use Install;

    /**
     * @throws DirectoryCreateException
     * @throws Exception
     */
    public function install($flags, $options): void
    {
        $object = $this->object();
        if($object->config(Config::POSIX_ID) !== 0){
            return;
        }
        $application_list = $this->install_system_application(
            $flags,
            $options,
        );
        foreach($application_list as $application){
            $this->install_api($options, $application);
            $this->install_application($options, $application);
            /*
            Navigation::create(
                $object,
                $options,
                $application
            );
            */
        }
        /*
        $frontend_options = null;
        $has_frontend = false;
        if(property_exists($options, 'frontend')){
            if(property_exists($options->frontend, 'host')){                
                $has_frontend = true;
                $frontend_options = [
                    'where' => [
                        [
                            'value' => $options->frontend->host,
                            'attribute' => 'name',
                            'operator' => 'partial',
                        ]
                    ]
                ];
            }                
        }
        $backend_options = null;
        $has_backend = false;
        if(property_exists($options, 'backend')){
            if(property_exists($options->backend, 'host')){                
                $has_backend = true;
                $backend_options = [
                    'where' => [
                        [
                            'value' => $options->backend->host,
                            'attribute' => 'name',
                            'operator' => 'partial',
                        ]
                    ]
                ];                
            }
        }
        if($has_frontend === false){
            throw new Exception('Frontend.host option is required and must be defined in Node/System.Host.json aborting...');
        }
        if($has_backend === false){
            throw new Exception('Backend.host option is required and must be defined in Node/System.Host.json aborting...');
        }
        $class = 'System.Host';
        $node = new Node($object);
        $response_frontend = $node->record($class, $node->role_system(), $frontend_options);
        $response_backend = $node->record($class, $node->role_system(), $backend_options);
        $options->frontend = $response_frontend['node'];
        $options->backend = $response_backend['node'];
        $this->install_api($options);
        $this->install_application($options);
        //maka a system.application record with no extensions for this desktop app.
        //every root/admin user should be in the user array by default
        //desktop would not be installable without a user then?

        //$this->install_system_application($options);
//        $this->install_application($options_application);
        */
        $command = 'app install raxon/account -patch';
        Core::execute($object, $command, $output, $notification);
        if($output){
            echo $output;
        }
        if($notification){
            echo $notification;
        }
    }

}