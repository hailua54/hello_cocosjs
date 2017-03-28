import sys, getopt
import os, shutil
if os.path.exists('html5'):
        shutil.rmtree('html5')
	
def main(argv):
	os.system("cocos compile -m release -p web");
	shutil.copytree('publish/html5', 'html5');
	
if __name__ == "__main__":
	main(sys.argv[1:])