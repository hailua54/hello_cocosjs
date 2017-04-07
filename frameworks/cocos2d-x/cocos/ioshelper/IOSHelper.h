//
//  GlobalVals.h
//  hello_cocosjs
//
//  Created by Nguyen Ngoc Vu Anh on 3/29/17.
//
//

#import <Foundation/Foundation.h>

@interface IOSHelper : NSObject
{
    UIView* container;
}
+ (IOSHelper*) getInstance;
- (void) initContainer: (UIView*) view;
- (UIView*) getContainer;
@end
