//
//  GlobalVals.m
//  hello_cocosjs
//
//  Created by Nguyen Ngoc Vu Anh on 3/29/17.
//
//

#import "IOSHelper.h"
static IOSHelper* _instance;
@implementation IOSHelper

+ (IOSHelper*) getInstance
{
    if (!_instance) _instance = [[IOSHelper alloc] init];
    return _instance;
}

- (void) initContainer:(UIView *)view
{
    container = view;
}

- (UIView*) getContainer {return container;};

@end
