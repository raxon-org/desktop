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
    public static function create(App $object, array $list=[], object|null $options=null): void
    {
        if(!property_exists($options, 'name')){
            throw new Exception('$options name is required.');
        }
        if(property_exists($options, 'route') && property_exists($options->route, 'name')){
            //nothing
        } else {
            throw new Exception('$options route->name is required.');

        }
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
                                'value' => self::NAME,
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
                        "name" => self::NAME,
                        "user" => $user->uuid ?? null,
                        "route" => (object)[
                            'name' => self::ROUTE_NAME,
                            'get' => '{{route.name($this.name)}}'
                        ],
                        "url" => '{{route.get($this.route.get)}}',
                        "svg" => '/Application/' . self::NAME . '/Icon/Icon.png',
                        "icon" => '/Application/' . self::NAME . '/Icon/Icon.png'
                    ];
                    $response = $node->create($class, $role, $record);
                }
            }
        }
    }


}