---
title: 3.3 - 代码调试策略
alias: 3.3 - 代码调试策略
origin: /a-strategy-for-debugging/
origin_title: "3.3 — A strategy for debugging"
time: 2020-1-22
type: translation
tags:
- debugging
---


在调试程序时，在大多数情况下，你的绝大多数时间将花在试图找到错误的实际位置上。一旦发现问题，剩下的步骤(修复问题和验证问题已修复)相比起来通常是微不足道的。

在这节课中，我们将开始探索如何查找错误。

## 通过代码检视找到问题

假设您注意到一个问题，您想要追踪这个特定问题的原因。在许多情况下(特别是在较小的程序中)，我们可以快速地定位问题所在的位置。

考虑下面的程序片段：

```cpp
int main()
{
    getNames(); // ask user to enter a bunch of names
    sortNames(); // sort them in alphabetical order
    printNames(); // print the sorted list of names

    return 0;
}
```

如果你期望这个程序按字母顺序打印名称，但它打印的结果却是相反的，那么问题可能出在 `sortNames` 函数上。对于这种可以将问题缩小到特定函数的情况下，只需查看代码就可以发现问题。

然而，随着程序变得越来越复杂，通过代码检查发现问题也变得越来越复杂。

首先，有很多代码要看。在一个数千行长的程序中，逐行走读代码会花费很长时间(而且非常无聊)。其次，代码本身往往更复杂，很多地方都可能出错。第三，代码的行为可能不能提高太多线索。如果你编写了一个输出股票推荐的程序，而它实际上什么也没有输出，那么我们可能就不知道从哪里开始查找问题了。

最后，错误可能是由错误的假设引起的。几乎不可能从视觉上发现由错误假设引起的错误，因为在检查代码时，我们往往倾向于会做出同样的错误假设，导致没有注意到错误。所以，如果一个程序无法通过代码检视发现问题，那应该如何定位呢？

## 通过运行程序找到问题

所幸，如果不能通过代码检视发现问题，还可以采用另一种方法：在程序运行时观察它的行为，并尝试从中诊断问题。这种方法可以概括为:

1.  找到复现问题的条件；
2.  运行程序，获取信息，逐步逼近"真像"；
3.  重复上述步骤直到找到问题所在。

在本章的其余部分，我们将讨论实施这种方法的技术。

## 复现问题

发现问题的第一步也是最重要的一步是能够重现问题，原因很简单：如果你不能再次观察到问题的话，要如何才能定位它呢？

回到制冰机的类比——假设有一天你的朋友告诉你，你的制冰机坏了。你去检查的时候发现它工作得很好。你应该如何诊断这个问题？这个时候就比较棘手了。然而，如果你能够再次让制冰机进入到不能工作的状态，那么才可以开始定位问题。

如果一个软件bug很明显的(例如，程序在每次运行时都在相同的地方崩溃)，那么重现这个问题就相当简单了。然而，复现问题有时候是很困难的。例如该问题可能只发生在某些设备上，或只在特定情况下(例如，当用户输入某些输入时)才出现。这种情况下，设计一组复现问题的步骤会很有帮助。复现步骤是一个清晰且精确的分步执行列表，你可以遵循这些步骤使问题以更大的概率再次出现。我们的目标是就能够尽可能地使问题再次出现，这样就可以反复运行程序，并查找线索来确定是什么原因导致了问题。如果问题可以100%的重现，那自然是最理想的状态，但低于100%通常也是可以的。一个只有50%几率触发的问题，意味着我们需要花费两倍的时间来诊断问题，因为有一半的时间程序不会显示问题，因此不会提供任何有用的诊断信息。

## 关注问题

一旦我们能够比较稳定地复现问题，接下来就是找到导致问题的代码。根据问题的性质不同，这个过程可能很简单，也可能很困难。举个例子，假设我们不太清楚问题到底在哪里。我们怎么找到它?

这里可以做个类比。我们来玩个猜数字游戏，你需要猜一个1到10之间的数字，每猜一次，我就会告诉你是太高、太低还是正确：


```
You: 5
Me: Too low
You: 8
Me: Too high
You: 6
Me: Too low
You: 7
Me: Correct
```

在上面的游戏中，你不需要猜每一个数字来找到答案。通过猜测和考虑从每次猜测中学到的信息的过程，你可能只需几次猜测就可以“锁定”正确的数字(如果你使用最优策略，那么总是可以在4次或更少的猜测中找到目标数字)。

我们可以使用类似的方法来调试程序。在最坏的情况下，我们可能不知道bug在哪里。然而，我们知道问题一定是在程序开始到程序显示出我们可以观察到的第一个错误症状之间执行的代码中的某个地方。这至少排除了在出现第一个可观察到的症状后执行的程序部分。但这仍然可能留下大量的代码需要覆盖。为了诊断问题，我们将对问题的位置进行一些有根据的猜测，目的是快速找到问题所在。

通常情况下，无论是什么原因导致我们注意到问题，都会给我们一个接近实际问题所在的初始猜测。例如，如果程序在应该写入数据的时候没有写入文件，那么问题可能出在处理写入文件的代码的某个地方(废话!)然后我们可以使用上述游戏策略来尝试找出真正的问题所在。

例如：

-   如果在程序的某个时刻，我们可以证明问题还没有发生，这就类似于收到一个“低了”的结果——我们知道问题一定是在程序后面的某个地方。例如，如果我们的程序每次都在同一个地方崩溃，并且我们可以证明程序没有在程序执行的某个特定点崩溃，那么崩溃一定发生在代码的后面。
- 如果在程序的某个点上，我们可以观察到与问题相关的不正确行为，那么这就类似于接收到一个“高了”的结果，我们知道问题一定是在程序的早期某个地方。例如，假设一个程序输出某个变量`x`的值。你希望它输出`2`，但是它输出了8。变量`x`的值一定是错误的。如果在程序执行过程中的某个时刻，我们可以看到变量`x`已经有值`8`，那么我们就知道问题一定在这个时刻之前就已经发生了。

“高了低了”的类比并不完美——我们有时也可以从考虑中删除代码的整个部分，而不获得任何关于实际问题是在该点之前还是之后的信息。

我们将在下一课中展示这三种情况的例子。

最终，有了足够的线索，再配合使用合适的技术，我们就可以找到引起问题的确切位置！如果我们是因为某些错误假设而造成了问题，在这个过程中也可以被发现。当你排除了所有其他因素，剩下的一定是导致问题的唯一因素。那就只需要理解为什么了。

使用什么猜测策略取决于你自己——猜测策略应该根据bug的性质，因地制宜地使用。所以你可能需要尝试许多不同的方法来缩小问题的范围。当积累了足够多调试问题的经验时，你的直觉也会变得越来越准。

那么我们如何“猜测”呢？有很多方法可以做到这一点。我们将在下一章从一些简单的方法开始，然后我们将在这些方法的基础上继续发展，并在以后的章节中探讨其他方法。
