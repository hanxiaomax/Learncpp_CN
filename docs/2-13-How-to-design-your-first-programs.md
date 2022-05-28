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

	- 设计五步走：
		- 定目标
		- 定需求
		- 定工具、产出和备份
		- 问题分解
		- 确定相关事件发生的顺序
	- 实现两步走
		- 实现程序框架
		- 实现具体函数

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
    -   打扫卫生间
    -   打扫厨房

比之前容易处理了一些，因为我们可以逐项解决这些子问题了。不过，我们其实还能将这些任务继续分解：

-   打扫屋子
    -   清理地毯
    -   打扫卫生间
        -   清洗马桶
        -   清理水池
    -   打扫厨房
        - 清理灶台
        - 打扫灶台
        - 清洗水池
        - 倒垃圾

现在，我们面对的是一系列具有层次结构的问题了，而且它们中任何一项都不复杂。通过完成这些相对更容易处理的子任务之后，我们也就完成了打扫屋子这个更复杂的问题。

另外一种分解任务的方式称为**自底向上(bottom)** 方法。使用这种方法时，我们会从一系列简单的任务开始，然后通过合并分组的方式构建任务列表。

大多数人平时不是上学就是上班，那么就以此来举例，假设我们要解决的是“去上班”这个问题，如果有人问你，你早上出门前都做哪些事呢？你的回答可能包含下面这些任务：

-   拿出要穿的衣服
-   穿衣
-   吃早饭
- 开车去公司
- 刷牙
- 起床
- 做早餐
- 上车
- 洗澡

使用自底向上的方法，我们可以基于它们的相似性，为这些任务创建一个层次结构：

-  从起床到上班要做的事
	- 卧室要做的事
		- 起床
		- 拿衣服
		- 穿衣
	- 卫生间要做的事
		- 洗澡
		- 刷牙
	- 早餐相关
		- 准备麦片
		- 吃麦片
	- 通勤相关
		- 上车
		- 开车到公司

其实我们不难看出，这些层次结构对于编程来说是非常有用的，因为一旦任务的结构清楚了，程序的大体结构其实也已经清楚了。最上层的任务（打扫屋子或去上班）就可以是程序的`main()`函数（因为它是你要解决的主要(main)问题）。而其他子项目则可以实现为不同的函数。

如果其中某一项任务（函数）在实现时仍然过于困难，则可以继续将其分解为几个子问题。最终你就可以将程序分割为多个容易实现的函数。

## 设计步骤5：确定相关事件发生的顺序

现在，程序的结构已经清楚了，接下来需要将这些任务关联其他。首先，我们要确定这些要任务的发生顺序。例如，你早上起来，完成上面那些任务的顺序是什么？差不多应该是这样的吧：

-   卧室要做的事
-   卫生间要做的事
-   早餐相关
-   通勤相关

如果你要编写一个计算器程序，我们可能会按照下面步骤来做：

-   从用户获取第一个数
-   从用户获取需要执行的运算操作
-   从用户获取第二个数
-   计算结果
-   打印结果

完成上述设计工作后，我们就可以开始实现代码了！

## 实现步骤1：编写main函数框架

现在可以开始实现代码了。根据上面顺序结构，我们可以先完成`main`函数的框架，暂时无需担心输入输出的问题。

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

或者对于计算器例子来说是这样的：

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

注意，如果你也使用这种“大纲框架”的方法来构建程序，这里涉及的函数都是无法编译的，毕竟它们还没有被定义。在函数被实际定义前先将其暂时先注释掉是一种方法（上面展示的就是这种方法）。此外，你还可以对函数进行[[stub|打桩(stub)]]，即为程序创建一个空的函数体，以便程序可以编译通过。


## 实现步骤2：实现每个函数

在这一步，对于每个函数都需要做三件事：

1.  定义函数的原型（输入输出）；
2.  编写函数；
3.  测试函数。

如果你的函数粒度足够细，那么每个函数都应该是非常简单和直接的。如果一个函数实现起来非常复杂，那么很可能它还需要被进一步分割为多个更容易实现的子函数（*也可能是你的任务顺序有问题，你应该重新审视一下各个步骤的顺序*）。

接下来，实现计算器程序中的第一个函数：

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
    // 从用户获取第一个输入
    int value{ getUserInput() }; // 注意，这里的代码本身就具备测试函数输出的功能
    std::cout << value; // 用于确保 getUserInput() 能够正常工作的调试代码，稍后需要移除
    
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

首先，确定函数 `getUserInput` 不需要接受任何[[arguments|实参]]。同时，该函数会返回一个整型值给主调函数。反映到函数原型上，即函数返回值类型为`int`，同时没有[[parameters|形参]]。接下来，编写函数体。函数体非常直接，只包含四条语句[[statement|语句]]。最后，在`main`函数中编写一些用于测试函数 `getUserInput` 功能（包括其返回值) 的临时代码，确定函数是否能够正常工作。

多次运行程序并使用不同的输入值，确保程序的结果都符合预期。如果发现程序不能正确工作，则问题可能就出在刚才编写的代码中。

一旦你确定程序可以正常工作了，那么这些临时测试代码就可以被移除了，然后开始实现下一个函数（`getMathematicalOperation`）。我们并不会在本节课中实现所有函数，因为还有一些更加重要的话题需要讨论。

记住：不要期望一次性实现全部的代码。一步一步完成，并且每一步都要进行测试。


## 实现步骤3：最终测试

当程序编写“完成”后，最后一步则是对完整的程序进行测试，确定其行为是否满足预期。如果不满足，则需要进行修复。

## 编程忠言

**开始时一切从简**：很多新手程序员对其要实现的程序和功能具有宏伟的蓝图：“我想要设计一款具有图形界面、配乐和随机地牢的角色扮演游戏。不仅如此，游戏地图还包括城镇，你可以在城镇里售卖你收集到的战利品”。如果你从一开始就要完成一个非常复杂的任务，你可能会在进度不佳时感到不知所措或心灰意冷。所以，你其实应该将你开始时的目标设的尽可能简单，即一些你肯定能够完成的目标。例如，“我想要在屏幕上显示一个2D的区域”。

**逐渐添加新的功能**：当上述简单的程序可以正常工作后，你就可以考虑为其增加新的功能了。例如，当上述2D区域可以被正常显示在屏幕上后，你可以添加一个能够移动的角色。当角色可以移动后，添加一些墙体限制角色的移动路径。墙体完成后，可以利用墙体来构建一个城镇地图。城镇完成后，添加一个商人NPC。通过这种循序渐进的方式为你的程序添加新功能，程序最终会变得越来越复杂，同时也不会让你在这个过程中感到不知所措。

**一次只做一件事**：不要期望一次性写完全部的代码，也不要把你的注意力分散在多个任务上。一次只做一件事比Don’t try to code everything at once, and don’t divide your attention across multiple tasks. Focus on one task at a time. It is much better to have one working task and five that haven’t been started yet than six partially-working tasks. If you split your attention, you are more likely to make mistakes and forget important details.

**一边实现、一边测试**. New programmers will often write the entire program in one pass. Then when they compile it for the first time, the compiler reports hundreds of errors. This can not only be intimidating, if your code doesn’t work, it may be hard to figure out why. Instead, write a piece of code, and then compile and test it immediately. If it doesn’t work, you’ll know exactly where the problem is, and it will be easy to fix. Once you are sure that the code works, move to the next piece and repeat. It may take longer to finish writing your code, but when you are done the whole thing should work, and you won’t have to spend twice as long trying to figure out why it doesn’t.

**不要过早地优化代码**. The first draft of a feature (or program) is rarely good. Furthermore, programs tend to evolve over time, as you add capabilities and find better ways to structure things. If you invest too early in polishing your code (adding lots of documentation, full compliance with best practices, making optimizations), you risk losing all of that investment when a code change is necessary. Instead, get your features minimally working and then move on. As you gain confidence in your solutions, apply successive layers of polish. Don’t aim for perfect -- non-trivial programs are never perfect, and there’s always something more that could be done to improve them. Get to good enough and move on.

Most new programmers will shortcut many of these steps and suggestions (because it seems like a lot of work and/or it’s not as much fun as writing the code). However, for any non-trivial project, following these steps will definitely save you a lot of time in the long run. A little planning up front saves a lot of debugging at the end.

The good news is that once you become comfortable with all of these concepts, they will start coming more naturally to you. Eventually you will get to the point where you can write entire functions without any pre-planning at all.

