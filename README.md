# Simple typescript project structure for COCOSJS

## Setup

- TypeScript IDE: Atom and typescript module for atom (https://atom.io/packages/atom-typescript)
- Nodejs and typescript compile module (https://www.npmjs.com/package/typescript-compiler)
- Cososjs typescript definition (https://github.com/jamma/cocos2d-typescript-definitions.git)
- Cocos2d-x 3.11.1+

## Initialize

- Modify cocos2d/core/platform.d.ts

	```ts
	//add the one more method Class
	export class Class {
		public _super():void;
		//...
	}
	```
	
- Modify project.json (no more load app.js)
	
	```json
	"jsList" : [
	"src/resource.js",
	"src/game.js"
	```
	
- Modify main.js to create Game object

	```js
	cc.LoaderScene.preload(g_resources, function () {
		//cc.director.runScene(new HelloWorldScene()); 
		var game = new Game();
	}, this);
	```
		
- Modify frameworks/cocos2d-x/cocos/base/CCDirector.cpp
	
	```c
	void Director::reset()
	{    
		if (_runningScene)
		{
			_runningScene->onExit();
			_runningScene->cleanup();
			_runningScene->release();
		}
		
		_runningScene = nullptr;
		_nextScene = nullptr;

		Director::getInstance()->getEventDispatcher()->dispatchCustomEvent("game_on_exit");
		// ...
	}
	```

## Tip

- The code using tab size = 2. To view the draw code with github, put a tab size on the url ?ts=2
Ex: https://github.com/hailua54/hello_cocosjs/blob/master/typescript/src/scenes/StartScene.ts?ts=2

## References

- GC

http://wiki.luajit.org/New-Garbage-Collector#gc-algorithms_two-color-mark-sweep

Ruby 2.2 GC

https://engineering.heroku.com/blogs/2015-02-04-incremental-gc/

- Touch event
http://www.cocos2d-x.org/wiki/EventDispatcher_Mechanism
		