define(function() {

    function loadTab (target, inst_id, loader) {
        
        if (loader) {
                
            loader.style.display = "block";
        }
        
        target.remAttr({ "class": "active" });
        
        N.comp(target, inst_id, function(err, inst) {
            
            if (!err) {
            
                if (inst && inst.obs) {
                    
                    inst.obs.l("load", function() {
                    
                        if (loader) {
                                
                            loader.style.display = "none";
                        }
                        target.addAttr({ "class": "active" });
                    });
                }
                else {
                    
                    if (loader) {
                        
                        loader.style.display = "none";
                    }
                    target.addAttr({ "class": "active" });
                }
            }
            else if (loader) {
            
                loader.style.display = "none";
            }
        });
    }
    
    return {
        
        init: function(config) {
        
            var view = this,
                _tab, parent,
                attr = { "class": "active" },
                loader = N.dom.findOne(config.loader, this.inst.dom),
                loaded;
            
            //get tab content ref
            if (config.tab) {
                
                _tab = N.dom.findOne(config.tab, view.inst.dom);
                parent = _tab.parentNode;
                tabs = [];
                items = [];
            }
            
            view.obs.l("itemHandler", function(item, data, tab) {
                
                //create tabs and load component
                if (data.c && _tab) {
                    
                    //collect items and tabs dom references
                    items.push(item);
                    tabs.push(tab = _tab.cloneNode(true));
                    
                    //add comp class to item
                    item.addAttr({ "class": "comp" });
                    
                    //start tab
                    if (!loaded && data.a) {
                        
                        loaded = 1;
                        
                        item.addAttr(attr);
                        
                        loadTab(tab, data.c, loader);
                    }
                    
                    parent.appendChild(tab);
                    
                    //visual fx
                    item.bind(config.event, function(event) {
                        
                        event.stopPropagation();
                        
                        for (var i = 0, l = tabs.length; i < l; ++i) {
                            
                            items[i].remAttr(attr);
                            tabs[i].remAttr(attr);
                        }
                        
                        item.addAttr(attr);
                        
                        loadTab(tab, data.c, loader);
                    });
                }
                
                //add logout event
                if (data.l) {
                    
                    item.bind("click", function() {
                    
                        N.link("/logout", function(err) {
                            
                            if (!err) {
                                    
                                N.comp( "body", null, 1);
                            }
                        });
                    });
                }
                
                //add right class to item
                if (data.r) {
                    
                    item.addAttr({ "class": "right" });
                }
                
                //attach event to tab button
                if (view.inst[data.h]) {
                    
                    item.bind(config.event, instance[data.h]);
                }
            });
        }
    };
});