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