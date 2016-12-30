# Simple typescript project structure for COCOSJS

## Setup

TypeScript IDE Atom 

Nodejs and typescript compile module

Cososjs typescript definition (https://github.com/jamma/cocos2d-typescript-definitions.git)

Cocos2d-x 3.1.1

## Initialize

For typescript definition:

	Modify cocos2d/core/platform.d.ts
	
		add the one more method Class
		
		export class Class {
		
			public _super():void;
			
			...
			
		}
		
	Modify project.json (no more load app.js)
	
	    "jsList" : [
		
        "src/resource.js",
		
        "src/game.js"
		
	Modify main.js to create Main Scene
	
		cc.LoaderScene.preload(g_resources, function () {
		
			//cc.director.runScene(new HelloWorldScene()); 
			
			cc.director.runScene(new Main());
			
		}, this);
		