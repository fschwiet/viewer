/* global define: false, require: false */

define( [ 'jquery', 'libs/handlebars', 'mods/mastercontrol' ], function( $, Handlebars, mc ){
    'use strict';

    var hasContainer = false,
        s ={};

    s.options = {
        target: 'body',
        containerId: 'js-status',
        containerClassNames: 'status-wrap',
        tmpl: '<div class="status status-{{type}}">{{msg}} {{data}}</div>',
        eventName: 'status'
    };

    s.$el = null;

    s.tmpl = null;

    s.setup = function( cfg ){
        var containerHtml = '<div id="{{id}}" class="{{classNames}}"></div>';

        $.extend( s.options, cfg );

        if ( ! hasContainer ){
            containerHtml = containerHtml
                    .replace( '{{id}}', s.options.containerId )
                    .replace( '{{classNames}}', s.options.containerClassNames );

            $( s.options.target ).append( containerHtml );
            s.$el = $( '#' + s.options.containerId );
        }

        s.tmpl = Handlebars.compile( s.options.tmpl );

        return this;
    };

    s.listen = function(){
        mc.on( s.options.eventName, s.update );
        mc.on( s.options.eventName + '-clear' );
        s.$el
            .on( 'ajaxStart', function(){
                s.update({
                    type: 'info',
                    msg: 'loading more posts'
                });
            })
            .on( 'ajaxSuccess', s.clear )
            .on( 'ajaxError', function(){
                s.update({
                    type: 'alert',
                    msg: 'error while loading'
                });
            });
    };

    s.update = function( status ){
        status = status || {
            msg: 'default',
            type: 'info',
            data: null
        };

        s.$el.html( s.tmpl( status ) );
    };

    s.clear = function(){
        s.$el.empty();
    };

    return s;
});
