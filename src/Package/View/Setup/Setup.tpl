{{$register = Package.Raxon.Ace:Init:register()}}
{{if(!is.empty($register))}}
{{Package.Raxon.Ace:Import:role.system()}}
{{$flags = flags()}}
{{$options = options()}}
{{Package.Raxon.Ace:Main:install($flags, $options)}}
{{/if}}