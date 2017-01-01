# Simple typescript project structure for COCOSJS

## Setup

- TypeScript IDE: Atom and typescript module for atom (https://atom.io/packages/atom-typescript)
- Nodejs and typescript compile module (https://www.npmjs.com/package/typescript-compiler)
- Cososjs typescript definition (https://github.com/jamma/cocos2d-typescript-definitions.git)
- Cocos2d-x 3.11.1+

## Initialize

- Modify cocos2d/core/platform.d.ts

	add the one more method Class
	
	export class Class {
	
		public _super():void;
		
		...
		
	}
	
- Modify project.json (no more load app.js)

	"jsList" : [
	
	"src/resource.js",
	
	"src/game.js"
	
- Modify main.js to create Game object

	cc.LoaderScene.preload(g_resources, function () {
	
		//cc.director.runScene(new HelloWorldScene()); 
		
		var game = new Game();
		
	}, this);
		