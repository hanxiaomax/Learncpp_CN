---
title: 2.13 - 如何设计第一个程序
alias: 2.13 - 如何设计第一个程序
origin: /how-to-design-your-first-programs/
origin_title: "2.13 — How to design your first programs"
time: 2022-4-15
type: translation
tags:
- desgin
---

??? note "关键点速记"



在学习过基本的编程知识后，让我们来看看如何设计第一个程序。

当你坐下来开始编程的时候，通常你只有一些如何编写该程序的基本的想法，新手程序员通常会对如何将想法转变为代码感到不知所措。实际上，完成这件事所需要的技能与你在生活中学到的解决问题的技能并无差别。

最需要新手程序员们记住的是（也是最难做到的是）在开始**编写**代码前，一定要先**设计**你的程序。编程和盖房子在很多方面都很相像。想象一下，我们会在没有图纸的情况下就开始盖房子吗？很可能不会，除非你是个天才，不然你盖出来的房子一定问题不少：墙是斜的、顶是漏的等等。同样的，如果毫无计划就开始编程，写出来的代码也一定是问题百出，然后你就需要花费大量的时间去修复那些你本来就可以避免的问题。

在开始前稍加计划，不仅可以节约时间，还能避免很多让人感到沮丧的时刻。

在本节课中，我们会向你介绍一种将想法转变为简单的、可用的程序的基本方法。

## 设计步骤1：定目标

为了编写一个成功的程序，你必须要首先明确你的目标是什么。理想情况下，该目标应该用一两句话就可以描述。通常来讲，从用户的角度来描述编程的结果是很有用的，例如：

-   允许用户可以管理一些列的姓名并将其关联到电话号码；
-   随机生成看上去很酷的洞穴场景以作为游戏中的地牢来使用；
-   生成一个高股息股票的推荐列表；
-   对一个球从高塔掉落到地面所需的时间进行建模。

尽管这一步所做的事情看上去都是很显然的，它的作用却不容忽视。对于编程来说，最糟糕的莫过于你写完的程序却不是你想要的（或者你老板想要的）！

## 设计步骤2：定需求

尽管，定义问题有助于你确定你期望的结果是声明，但目标仍然是不清楚的。接下来一步就是考虑如何设计需求。

需求一方面指的是你能够使用的有限资源（例如，预算、工期、空间和内存等等），另一方面指的是你的程序必须具备的能够满足用户需要的能力。注意，需求关注的仍然是**什么**，而不是**如何**。

例如：

-   电话号码应该能够被储存，这样以后可以用来进行回拨；
-   随机的地牢应该总是包含一条从入口到出口的路；
-   股票推荐应该参考历史价格信息；
-   用户应该能够输入高塔的高度；
-   我们需要在七天内完成可供测试的版本；
-   程序需要在10秒内完成用户的请求； 
-   程序在用户使用时崩溃退出的概率应该小于 0.1%。

一个问题可能会派生出很多需求，只有所有的需求都被满足，才能说解决方案被实现了。

## 设计步骤3：定义工具、目标产物以及备份计划

如果你已经是一个有经验的程序员了，在设计过程中，你可能还需要考虑其他的一些问题，例如：

-   定义程序需要运行的平台的体系结构和（或）操作系统；
-   确定你需要使用哪些工具；
-   确定你是独立完成代码编写还是以团队合作的方式完成；
-   定义测试、反馈和释放策略；
-   定义如何备份代码。

不过，作为新手程序员，上面几个问题其实都很简单：你将会独立地在你自己的电脑上编写代码，所需的工具就是你下载并安装了的IDE，你编写的程序除了你自己没有其他人会使用。

即便如此，如果你编写的代码不是寥寥几行，你还是应该考虑一下如何备份你的代码。将代码拷贝或者压缩后放到电脑的其他目录中是不够的（尽管聊胜于无）。如果你的电脑坏了，你编写的代码也就付之东流了。一个好的备份策略，应该是把代码全部拷贝一份后拷到其他电脑或其他地方。有很多办法可以实现，例如将其压缩为Zip文件后发送到你自己的邮箱，拷贝到Dropbox或者网盘，或者通过FTP传到其他电脑，也可以通过局域网拷到其他电脑上，或者使用位于其他电脑或云端的版本控制系统（例如：Github）。版本控制系统除了存储文件以外，还有很多其他有用的功能，例如它可以将你的代码回退到之前的版本。

## 设计步骤4：将复杂问题切分为多个简单问题

在现实生活中，我们时常需要完成一些非常复杂的问题。找到的问题的解决办法，通常并不容易。在这种情况下，我们通常使用 **自顶向下(top down)** 的办法来解决问题。为了解决一个特别复杂的问题，我们通常会把这个问题分解为多个相对来说更容易解决的子问题。如果子问题仍然难以解决，它们还可以被进一步分割为更多的子问题。通过不断地将复杂问题分解成简单的子问题，你最终可以得到很多更容易被处理的子问题。

举例来说，如果我们需要打扫屋子，那么分解任务的结构可能会是像下面这样：

-   打扫屋子

打扫屋子是一个很大的任务，让我们将其分解为多个子任务：

-   打扫屋子
    -   清理地毯
    -   打扫浴室
    -   打扫厨房

比之前容易处理了一些，’s more manageable, as we now have subtasks that we can focus on individually. However, we can break some of these down even further:

-   Clean the house
    -   Vacuum the carpets
    -   Clean the bathrooms
        -   Scrub the toilet (yuck!)
        -   Wash the sink
    -   Clean the kitchen
        -   Clear the countertops
        -   Clean the countertops
        -   Scrub the sink
        -   Take out the trash

Now we have a hierarchy of tasks, none of them particularly hard. By completing each of these relatively manageable sub-items, we can complete the more difficult overall task of cleaning the house.

The other way to create a hierarchy of tasks is to do so from the **bottom up**. In this method, we’ll start from a list of easy tasks, and construct the hierarchy by grouping them.

As an example, many people have to go to work or school on weekdays, so let’s say we want to solve the problem of “go to work”. If you were asked what tasks you did in the morning to get from bed to work, you might come up with the following list:

-   Pick out clothes
-   Get dressed
-   Eat breakfast
-   Drive to work
-   Brush your teeth
-   Get out of bed
-   Prepare breakfast
-   Get in your car
-   Take a shower

Using the bottom up method, we can organize these into a hierarchy of items by looking for ways to group items with similarities together:

-   Get from bed to work
    -   Bedroom things
        -   Get out of bed
        -   Pick out clothes
        -   Get dressed
    -   Bathroom things
        -   Take a shower
        -   Brush your teeth
    -   Breakfast things
        -   Prepare cereal
        -   Eat cereal
    -   Transportation things
        -   Get in your car
        -   Drive to work

As it turns out, these task hierarchies are extremely useful in programming, because once you have a task hierarchy, you have essentially defined the structure of your overall program. The top level task (in this case, “Clean the house” or “Go to work”) becomes main() (because it is the main problem you are trying to solve). The subitems become functions in the program.

If it turns out that one of the items (functions) is too difficult to implement, simply split that item into multiple sub-items/sub-functions. Eventually you should reach a point where each function in your program is trivial to implement.

## 设计步骤5：找到一系列事件

Now that your program has a structure, it’s time to determine how to link all the tasks together. The first step is to determine the sequence of events that will be performed. For example, when you get up in the morning, what order do you do the above tasks? It might look like this:

-   Bedroom things
-   Bathroom things
-   Breakfast things
-   Transportation things

If we were writing a calculator, we might do things in this order:

-   Get first number from user
-   Get mathematical operation from user
-   Get second number from user
-   Calculate result
-   Print result

At this point, we’re ready for implementation.

## 实现步骤1：编写main函数框架

Now we’re ready to start implementation. The above sequences can be used to outline your main program. Don’t worry about inputs and outputs for the time being.

```cpp
int main()
{
//    doBedroomThings();
//    doBathroomThings();
//    doBreakfastThings();
//    doTransportationThings();

    return 0;
}
```

COPY

Or in the case of the calculator:

```cpp
int main()
{
    // Get first number from user
//    getUserInput();

    // Get mathematical operation from user
//    getMathematicalOperation();

    // Get second number from user
//    getUserInput();

    // Calculate result
//    calculateResult();

    // Print result
//    printResult();

    return 0;
}
```

COPY

Note that if you’re going to use this “outline” method for constructing your programs, your functions won’t compile because the definitions don’t exist yet. Commenting out the function calls until you’re ready to implement the function definitions is one way to address this (and the way we’ll show here). Alternatively, you can _stub out_ your functions (create placeholder functions with empty bodies) so your program will compile.

## 实现步骤2：实现每个函数


In this step, for each function, you’ll do three things:

1.  Define the function prototype (inputs and outputs)
2.  Write the function
3.  Test the function

If your functions are granular enough, each function should be fairly simple and straightforward. If a given function still seems overly-complex to implement, perhaps it needs to be broken down into subfunctions that can be more easily implemented (or it’s possible you did something in the wrong order, and need to revisit your sequencing of events).

Let’s do the first function from the calculator example:

```cpp
#include <iostream>

// Full implementation of the getUserInput function
int getUserInput()
{
    std::cout << "Enter an integer ";
    int input{};
    std::cin >> input;

    return input;
}

int main()
{
    // Get first number from user
    int value{ getUserInput() }; // Note we've included code here to test the return value!
    std::cout << value; // debug code to ensure getUserInput() is working, we'll remove this later

    // Get mathematical operation from user
//    getMathematicalOperation();

    // Get second number from user
//    getUserInput();

    // Calculate result
//    calculateResult();

    // Print result
//    printResult();

    return 0;
}
```

COPY

First, we’ve determined that the _getUserInput_ function takes no arguments, and will return an int value back to the caller. That gets reflected in the function prototype having a return value of int and no parameters. Next, we’ve written the body of the function, which is a straightforward 4 statements. Finally, we’ve implemented some temporary code in function _main_ to test that function _getUserInput_ (including its return value) is working correctly.

We can run this program many times with different input values and make sure that the program is behaving as we expect at this point. If we find something that doesn’t work, we know the problem is in the code we’ve just written.

Once we’re convinced the program is working as intended up to this point, we can remove the temporary testing code, and proceed to implementation of the next function (function _getMathematicalOperation_). We won’t finish the program in this lesson, as we need to cover some additional topics first.

Remember: Don’t implement your entire program in one go. Work on it in steps, testing each step along the way before proceeding.

	## 实现步骤3：最终测试

Once your program is “finished”, the last step is to test the whole program and ensure it works as intended. If it doesn’t work, fix it.

Words of advice when writing programs

**Keep your programs simple to start**. Often new programmers have a grand vision for all the things they want their program to do. “I want to write a role-playing game with graphics and sound and random monsters and dungeons, with a town you can visit to sell the items that you find in the dungeon” If you try to write something too complex to start, you will become overwhelmed and discouraged at your lack of progress. Instead, make your first goal as simple as possible, something that is definitely within your reach. For example, “I want to be able to display a 2-dimensional field on the screen”.

**Add features over time**. Once you have your simple program working and working well, then you can add features to it. For example, once you can display your field, add a character who can walk around. Once you can walk around, add walls that can impede your progress. Once you have walls, build a simple town out of them. Once you have a town, add merchants. By adding each feature incrementally your program will get progressively more complex without overwhelming you in the process.

**Focus on one area at a time**. Don’t try to code everything at once, and don’t divide your attention across multiple tasks. Focus on one task at a time. It is much better to have one working task and five that haven’t been started yet than six partially-working tasks. If you split your attention, you are more likely to make mistakes and forget important details.

**Test each piece of code as you go**. New programmers will often write the entire program in one pass. Then when they compile it for the first time, the compiler reports hundreds of errors. This can not only be intimidating, if your code doesn’t work, it may be hard to figure out why. Instead, write a piece of code, and then compile and test it immediately. If it doesn’t work, you’ll know exactly where the problem is, and it will be easy to fix. Once you are sure that the code works, move to the next piece and repeat. It may take longer to finish writing your code, but when you are done the whole thing should work, and you won’t have to spend twice as long trying to figure out why it doesn’t.

**Don’t invest in perfecting early code**. The first draft of a feature (or program) is rarely good. Furthermore, programs tend to evolve over time, as you add capabilities and find better ways to structure things. If you invest too early in polishing your code (adding lots of documentation, full compliance with best practices, making optimizations), you risk losing all of that investment when a code change is necessary. Instead, get your features minimally working and then move on. As you gain confidence in your solutions, apply successive layers of polish. Don’t aim for perfect -- non-trivial programs are never perfect, and there’s always something more that could be done to improve them. Get to good enough and move on.

Most new programmers will shortcut many of these steps and suggestions (because it seems like a lot of work and/or it’s not as much fun as writing the code). However, for any non-trivial project, following these steps will definitely save you a lot of time in the long run. A little planning up front saves a lot of debugging at the end.

The good news is that once you become comfortable with all of these concepts, they will start coming more naturally to you. Eventually you will get to the point where you can write entire functions without any pre-planning at all.

