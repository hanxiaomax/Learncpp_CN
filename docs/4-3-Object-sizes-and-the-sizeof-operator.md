---
title: 4.3 - 对象的大小和 sizeof 操作符
alias: 4.3 - 对象的大小和 sizeof 操作符
origin: /object-sizes-and-the-sizeof-operator/
origin_title: "4.3 — Object sizes and the sizeof operator"
time: 2022-1-2
type: translation
tags:
- sizeof
---

??? note "关键点速记"
	- C++ 只保证了每种基础数据类型占用空间的最小值，具体大小和编译器及计算机体系结构相关
	- CPU 按照某个长度来处理数据，只有当数据类型的大小等于该长度时才会更快，并不一定占用内存小的数据结构更快


## 对象的大小

正如在[[4-1-Introduction-to-fundamental-data-types|4.1 - 基础数据类型简介]]中介绍的那样，现代计算机以[[byte|字节(byte)]]为单位使用内存，每个字节的内存都有其唯一对应的地址。从这个角度来说，内存可以被想象成一系列的小储藏间或信箱，你可以从中存放或读取信息，而变量名则用来对这些储藏间或信箱进行访问。

不过，这个比喻并不完全准确——很多对象实际上占据的内存要大于1个字节。一个对象可能会使用2、4、8或者更多连续的内存地址。而对象使用多大的内存，取决于对象的数据类型。

因为我们通常使用变量名来访问内存（而非直接访问内存），编译器帮我们隐藏了上述细节，即一个对象占用多少内存。当使用变量 x 访问其对应的内存时，编译器指定应该获取多少字节的数据（基于 x 的数据类型），它为我们完成了上述工作。

即使这也，很多时候知道对象占用多少内存是有用的。

首先，对象占用的内存决定了该对象能够保存多少信息。

一个比特可以保存两个可能的值，即0或1：

| bit 0 | 
| ----- | 
| 0    | 
| 1      | 


| bit 0      | bit 1
| ----- | -----|
| 0    | 0
| 1      | 1
|1      | 0
|1      |1 


| bit 0      | bit 1 | bit 2 
| ----- | -----|-----|
| 0    | 0 |  0 
| 0    | 0 |  1
| 0    | 1 |  0
| 0    | 1 |  1
|1      | 0 |  0 
|1      | 0 |  1
|1      | 1 |  0 
|1      |1   |  1

概括来说，具有 n 个[[bit|位]]大小的对象（n为正整数）可以保存 $2^n$ 中不同的值（2的n次方，一般也写作`2^n`）。因此，对于一个8个比特的字节来说，大小位1字节的对象可以保存 $2^8$ (256)中可能的值。使用2个字节的对象可以保存 $2^{16}$ (65536)种不同的值！

因此，对象的大小决定了它能保存的不同值的上限——使用的内存越多，能够存放的不同值也就越多。我们会在后续的课程中对整型进行更详细地介绍。

其次，计算机的内存是有限的。当我们定义对象的时候，一小块空闲的内存就被占用了（只要该对象还存在）。因为现代计算机的内存相对来说比较多，所以占用一小块内存影响不大。但是，当程序中具有大量对象或者数据时（例如，一个正在渲染几百万个地牢的大型游戏），对象占用1个字节的大小还是8个字节就会造成很大的差别。

!!! tldr "关键信息"

	新手程序员通常过分关注优化他们的代码并使其程序能够使用尽可能少的内存。大多数情况下，这其实影响不大。你的注意力应该放在编写易于维护的代码，只有当优化可以带来显著收益的时候再去做。
	



## 基础数据类型的大小

接下来的问题很显然：”不同数据类型究竟占用多少内存？“。答案可能会令你吃惊，不同数据类型占用的内存和编译器以及（或）计算机体系结构有关。

C++ 只保证了每种基础数据类型最小的尺寸：

|分类|类型|最小尺寸|备注|
|---|---|---|---|
|boolean|bool|1 byte |
|character|char|1 byte | 总是1个字节
|character|wchat_t|1 byte |
|character|char16_t|2 byte |
|character|char32_t|4 byte |
|integer|short|2 byte |
|integer|int|2 byte |
|integer|long|4 byte |
|integer|long long|8 byte |
|floating point|float|4 byte |
|floating point|double|8 byte |
|floating point|long double|8 byte |

不然，这些变量的实际大小和你的机器相关（例如 `int` 通常就是4个字节）。

!!! success "最佳实践"

	处于兼容性考虑，你不能够假设变量的实际大小会大于其最小值。
	

## sizeof 运算符

为了确定数据类型在具体机器上占用的内存大小，C++ 提供了 `size` 运算符。该运算符是一个一元运算符，它使用一个数据类型或变量作为[[operands|操作数(operands)]]，计算得到该数据类型或变量占用内存的大小（以字节为单位）。你可以尝试编译和运行下面的程序以便确定在你的电脑上，各个数据类型都占用多少内存：

```cpp
#include <iostream>

int main()
{
    std::cout << "bool:\t\t" << sizeof(bool) << " bytes\n";
    std::cout << "char:\t\t" << sizeof(char) << " bytes\n";
    std::cout << "wchar_t:\t" << sizeof(wchar_t) << " bytes\n";
    std::cout << "char16_t:\t" << sizeof(char16_t) << " bytes\n";
    std::cout << "char32_t:\t" << sizeof(char32_t) << " bytes\n";
    std::cout << "short:\t\t" << sizeof(short) << " bytes\n";
    std::cout << "int:\t\t" << sizeof(int) << " bytes\n";
    std::cout << "long:\t\t" << sizeof(long) << " bytes\n";
    std::cout << "long long:\t" << sizeof(long long) << " bytes\n";
    std::cout << "float:\t\t" << sizeof(float) << " bytes\n";
    std::cout << "double:\t\t" << sizeof(double) << " bytes\n";
    std::cout << "long double:\t" << sizeof(long double) << " bytes\n";

    return 0;
}
```

作者使用的是 64 位机器，通过 Visual Studio 编译运行上述代码输出的结果如下：

```
bool:           1 bytes
char:           1 bytes
wchar_t:        2 bytes
char16_t:       2 bytes
char32_t:       4 bytes
short:          2 bytes
int:            4 bytes
long:           4 bytes
long long:      8 bytes
float:          4 bytes
double:         8 bytes
long double:    8 bytes
```

你得到的结果可能会和此处不一样，这取决于是否使用了不同的计算机或编译器。注意：你不能使用`sizeof`计算`void`的大小，因为它没有大小（这么做会导致编译器报错）。

!!! info "扩展阅读"

	也许你有兴趣知道上述代码中的`\t`有什么作用。这是一个特殊符号，用于插入一个制表符（在上面的例子中，我们使用它将输出结果按列对其）。我们会在[[4-11-Chars|4.11 - 字符]]中介绍`\t`和其他的特殊字符。

你也可以对变量名使用`sizeof`。

```cpp
#include <iostream>

int main()
{
    int x{};
    std::cout << "x is " << sizeof(x) << " bytes\n";

    return 0;
}
```


```
x is 4 bytes
```

!!! info "译者注"

	对指针使用`sizeof`的结果是固定的，不取决于指针指向什么类型的数据。通常为4或者8个字节。

## 基本数据结构的性能



在现代计算机上，基础数据类型的对象性能通常都非常好，因此这些变量的性能问题通常不需要我们特别考虑。


!!! cite "题外话"

    你可能会想当然地认为使用内存少的数据结构速度也会更快，实际上并不总是这样。CPU 通常会对数据的流程进行优化，按照某个长度来处理数据（例如32位），如果数据类型的大小恰好和该长度相同，则会更快一些。在这样的计算机上，32位的 int 会比 16为的 int 更快。