<?php
namespace Package\Raxon\Desktop\Module;

use Exception;
use Raxon\App;
use Raxon\Exception\ObjectException;
use Raxon\Node\Module\Node;

class Navigation
{
    /**
     * @throws ObjectException
     * @throws Exception
     */
    public static function create(App $object,object $options, object $application): void
    {
        if(!property_exists($application, 'name')){
            throw new Exception('$application name is required.');
        }
        if(property_exists($application, 'route') && property_exists($application->route, 'name')){
            //nothing
        } else {
            throw new Exception('$application route->name is required.');

        }
        if(!property_exists($application, 'user')){
            throw new Exception('$application user (array of user uuids) is required.');
        }
        foreach($application->user as $user_uuid){
            $node = new Node($object);
            $class = 'Application.Desktop.Navigation';
            $role = $node->role_system();
            $response = $node->record(
                $class,
                $role,
                [
                    'where' => [
                        [
                            'attribute' => 'name',
                            'operator' => '===',
                            'value' => $application->name,
                        ],
                        'and',
                        [
                            'attribute' => 'user',
                            'operator' => '===',
                            'value' => $user_uuid,
                        ]
                    ],
                    'relation' => false
                ]
            );
            if ($response === null) {
                $record = [
                    "name" => $application->name,
                    "user" => $user_uuid ?? null,
                    "route" => (object)[
                        'name' => $application->route->name,
                        'get' => '{{route.name($this.name)}}'
                    ],
                    "url" => '{{route.get($this.route.get)}}',
                    "svg" => '/Application/' . $application->name . '/Icon/Icon.png'
                ];
                $response = $node->create($class, $role, $record);
            }
        }
        /*
        foreach($list as $nr => $user){
            if(
                is_object($user) &&
                property_exists($user, 'uuid')
            ) {
                $node = new Node($object);
                $class = 'Application.Desktop.Navigation';
                $role = $node->role_system();
                $response = $node->record(
                    $class,
                    $role,
                    [
                        'where' => [
                            [
                                'attribute' => 'name',
                                'operator' => '===',
                                'value' => $application->name,
                            ],
                            'and',
                            [
                                'attribute' => 'user',
                                'operator' => '===',
                                'value' => $user->uuid,
                            ]
                        ],
                        'relation' => false
                    ]
                );
                if ($response === null) {
                    $record = [
                        "name" => $application->name,
                        "user" => $user->uuid ?? null,
                        "route" => (object)[
                            'name' => $application->route->name,
                            'get' => '{{route.name($this.name)}}'
                        ],
                        "url" => '{{route.get($this.route.get)}}',
                        "icon" => '/Application/' . $application->name . '/Icon/Icon.png'
                    ];
                    $response = $node->create($class, $role, $record);
                }
            }
        }
        */
    }


}