{{$register = Package.Raxon.Desktop:Init:register()}}
{{if(!is.empty($register))}}
{{Package.Raxon.Desktop:Import:role.system()}}
{{$flags = flags()}}
{{$options = options()}}
{{Package.Raxon.Desktop:Main:install($flags, $options)}}
{{/if}}