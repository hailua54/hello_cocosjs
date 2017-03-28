import sys, getopt
import os, shutil

def copy_and_overwrite(from_path, to_path):
    if os.path.exists(to_path):
        shutil.rmtree(to_path)
    shutil.copytree(from_path, to_path)
	
def main(argv):
	des = ''
	try:
		opts, args = getopt.getopt(argv,"hd:",[])
	except getopt.GetoptError:
		print sys.argv[0] + ' -d <project directory>'
		sys.exit(2)
	for opt, arg in opts:
		if opt == '-h':
			print sys.argv[0] + ' -d <project directory>'
			sys.exit()
		elif opt == '-d':
			des = arg
	print 'des is "' + des + '"'
	
	copy_and_overwrite('res', des + '/res');
	copy_and_overwrite('design', des + '/design');
	copy_and_overwrite('typescript', des + '/typescript');
	copy_and_overwrite('src', des + '/src');
	copy_and_overwrite('frameworks/runtime-src/Classes', des + '/frameworks/runtime-src/Classes');
	copy_and_overwrite('frameworks/runtime-src/proj.android-studio/app/src/org/cocos2dx/javascript', des + '/frameworks/runtime-src/proj.android-studio/app/src/org/cocos2dx/javascript');
	
	shutil.copyfile('index.html', des + '/index.html');
	shutil.copyfile('main.js', des + '/main.js');
	shutil.copyfile('project.json', des + '/project.json');
	shutil.copyfile('frameworks/cocos2d-x/cocos/base/CCDirector.cpp', des + '/frameworks/cocos2d-x/cocos/base/CCDirector.cpp');
	shutil.copyfile('frameworks/cocos2d-html5/extensions/cocostudio/loader/parsers/timelineParser-2.x.js', des + '/frameworks/cocos2d-html5/extensions/cocostudio/loader/parsers/timelineParser-2.x.js');
	shutil.copyfile('frameworks/cocos2d-x/cocos/scripting/js-bindings/script/studio/parsers/timelineParser-2.x.js', des + '/frameworks/cocos2d-x/cocos/scripting/js-bindings/script/studio/parsers/timelineParser-2.x.js');
	
if __name__ == "__main__":
	main(sys.argv[1:])