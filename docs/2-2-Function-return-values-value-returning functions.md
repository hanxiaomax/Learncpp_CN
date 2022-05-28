---
title: 2.2 - 函数返回值
alias: 
origin: /function-return-values-value-returning-functions/
origin_title: "2.2 — Function return values (value-returning functions"
time: 2022-4-22
type: translation
tags:
- return
- undefined behavior 
- function
---



请考虑下面这个程序：

```cpp
#include <iostream>

int main()
{
    // get a value from the user
    std::cout << "Enter an integer: ";
    int num{};
    std::cin >> num;

    // print the value doubled
    std::cout << num << " doubled is: " << num * 2 << '\n';

    return 0;
}
```

这个程序从概念上将包含两部分：首先我们从用户获取一个输入，然后告诉用户该输入的两倍是多少。

虽然这个程序已经足够简单，没必要将其划分为多个函数，但如果我们执意要这么做呢？从用户获取输入是一个非常明确的任务，将其作为一个函数应该是很合适的。

因此，程序被修改成了下面这样：

```cpp
// This program doesn't work
#include <iostream>

void getValueFromUser()
{
     std::cout << "Enter an integer: ";
    int input{};
    std::cin >> input;
}

int main()
{
    getValueFromUser(); // Ask user for input

    int num{}; // How do we get the value from getValueFromUser() and use it to initialize this variable?

    std::cout << num << " doubled is: " << num * 2 << '\n';

    return 0;
}
```

尽管看上去上面的尝试没什么问题，但实际上它却不能正常工作。

当函数 `getValueFromUser` 被调用时，程序会要求用户输入一个整型数，这符合我们的预期。但是当函数 `getValueFromUser` 调用结束并返回 `main` 函数时，刚才输入的值就被丢弃了。变量 `num` 始终都没有被初始化为用户输入的值，因此输出结果始终是 `0`。

问题出在 `getValueFromUser` 函数返回到 `main` 函数的时候，我们没有将用户输入的值一起返回，因此 `main` 函数就无法使用该值。

## 返回值

在编写函数的时候，我们需要确定该函数是否应该返回一个值给主调函数。如果需要，有两件事需要去做。

首先，必须指定函数返回值的类型，函数返回值类型的定义位于函数名前面。在上面的例子中，`getValueFromUser` 函数的返回值类型为 `void`（表示无需返回任何值给主调函数），而 `main` 函数的返回值类型则为 `int` （即返回一个 `int` 类型的值给主调函数）。注意，这里并不是定义返回的具体是什么值，而仅是指定其*类型*。

!!! info "相关内容"

	返回值为 `void` 类型的函数将在下节课中介绍（[[2-3-Void-functions-non-value returning functions]]）

其次，在需要返回值的函数中，需要通过 `return` 语句来指定要返回的具体值。该具体值称为函数的**返回值**。当 `return` 语句被执行时，函数会立即退出，同时将返回值*拷贝*给主调函数。这个过程称为**值返回**（return by value）。

以下面这个简单的函数为例，它返回一个整型值：

```cpp
#include <iostream>

// int 是返回值类型
// 返回值类型为 int 意味着函数会返回某个整型值给主调函数（具体是什么值并不会在此处指定）
int returnFive()
{
    // return 语句指定了要返回的具体值
    return 5; // 返回 5 给主调函数
}

int main()
{
    std::cout << returnFive() << '\n'; // prints 5
    std::cout << returnFive() + 2 << '\n'; // prints 7

    returnFive(); // 函数返回了 5，但是该值被忽略了，因为没有使用该值做任何事情

    return 0;
}
```

函数执行结果如下：

```
5
7
```

代码执行从 `main` 的顶部开始执行，第一条语句对 `returnFive` 进行了求值，即调用了该函数。函数 `returnFive` 返回值为 5，该值返回给主调函数后，通过 `std:: cout` 被打印到控制台。

在第二处函数调用，语句 `returnFive` 进行了求值， 其结果就是 `returnFive` 函数再次被调用。函数仍然将返回值 5 返回给了主调函数。表达式 `5 + 2` 的求值结果是 7，随后该值通过 `std:: cout` 被打印到了控制台。

第三条语句再次调用了 `returnFive` 函数，其返回值仍然被返回给了主调函数，但是 `main` 函数并没有对该返回值进行任何操作，因此什么事情都没有发生（返回值被忽略了）。

注意：除非主调函数通过 `std:: cout` 将返回值发送到控制台进行打印，否则该值并不会被打印。在上面的例子中，最后一次调用函数时，主调函数没有将返回值发送到 `std:: cout`，因此其结果没有打印。


!!! tip "小贴士"

	当被调函数返回值是，主调函数可以决定是否在表达式或者语句中使用该返回值（例如：将其赋值给某个变量或将其发送到 `std:: cout`），也可以忽略它（不对返回值做任何操作）。

## 修改程序

有了上面的知识，我们可以对课程开始时的程序进行适当的修改：

```cpp
#include <iostream>

int getValueFromUser() // this function now returns an integer value
{
     std::cout << "Enter an integer: ";
    int input{};
    std::cin >> input;

    return input; // return the value the user entered back to the caller
}

int main()
{
    int num { getValueFromUser() }; // 使用 getValueFromUser() 的返回值对 num 进行初始化

    std::cout << num << " doubled is: " << num * 2 << '\n';

    return 0;
}
```

当上述程序开始执行时，`main` 函数中的第一条语句会创建一个 `int`  类型的变量 `num`。当程序准备要对 `num`  初始化时，它会发现此处有一个函数调用 `getValueFromUser()`，因此它会跳转去执行该函数。函数 `getValueFromUser` 要求用户输入一个值，然后它将该输入值返回给主调函数(`main`)。该返回值被用来对变量 `num` 进行初始化。

请自行编译该函数并运行其几次以确保程序能够正确运行。

## 返回到主函数

现在，我们可以使用思维工具来理解 `main` 函数是如何工作的。当程序执行时，操作系统会创建一个函数调用取调用 `main` 函数。随后程序就会跳转到 `main` 函数的顶部开始执行。函数体中的语句会顺序执行。最终，`main` 函数会返回一个整型值（通常是 0），然后程序就终止了。`main` 函数的的返回值通常称为状态码（有时也称为退出状态码，极少数情况下也称为返回码），因为该返回值用来反映程序是否正确执行。

根据定义，状态码为 `0` 表示程序执行成功。

!!! success "最佳实践"

	如果程序正常运行，`main` 的返回值应该为 `0`。

非 0 的返回值通常用来表示程序执行失败（尽管大多数操作系统都按照上述约定来对待返回值，但是严格来讲，其可移植性并不能得到保证）。

!!! info "扩展阅读"

	C++标准中值定义了三种返回状态码：0、`EXIT_SUCCESS 和 ` `EXIT_FAILURE`。0 和 `EXIT_SUCCESS` 都表示程序执行成功。`EXIT_FAILURE` 则表示程序没有成功执行。

`EXIT_SUCCESS` 和 `EXIT_FAILURE` 在  `<cstdlib>` 头文件中声明：

```cpp
#include <cstdlib> // for EXIT_SUCCESS and EXIT_FAILURE

int main()
{
    return EXIT_SUCCESS;
}
```

如果你想尽可能保证可移植性，请使用 `0` 或者 `EXIT_SUCCESS` 表示程序成功执行，或者使用 `EXIT_FAILURE` 表示程序执行失败。

C++ 不允许显式调用 `main` 函数。

就目前而言，你还应该将 `main` 函数定义在文件的最下方，即定义在其他所有函数后面。

## 具有返回值的函数不返回值则会产生未定义行为

 一个会返回值的函数，称为具有返回值的函数(value-returning function)，除非返回值类型是 `void`，否则都属于具有返回值的函数。

一个具有返回值的函数必须返回对应类型的值（使用 `return` 语句），否则会产生未定义行为。

!!! info "相关内容"
 
	 我们在[[1-6-Uninitialized-variables-and-undefined-behavior]]中讨论了未定义行为。

下面是一个函数产生未定义行为的例子：

```cpp
#include <iostream>

int getValueFromUser() // this function returns an integer value
{
     std::cout << "Enter an integer: ";
    int input{};
    std::cin >> input;

    // 注意：没有 return 语句
}

int main()
{
    int num { getValueFromUser() }; // initialize num with the return value of getValueFromUser()

    std::cout << num << " doubled is: " << num * 2 << '\n';

    return 0;
}
```

在编译上述代码的时候，现代编译器会产生错误信息，因为 `getValueFromUser` 定义了 `int` 类型的返回值但实际上并没有包含 `return` 语句。然而，如果程序出于某种原因编译通过了，那么在运行上述程序时就会产生未定义行为，因为 `getValueFromUser()` 是具有返回值的函数，但并没有返回一个值。

大多数情况下，如果你忘记返回值，编译器是能够检测到的。但是，有一些非常复杂的情况，编译器有可能无法确定函数是否返回值的。所以你不应该依赖编译器。

!!! success "最佳实践"

	确保非 `void` 类型的函数在任何情况下都返回值。
	
	具有返回值的函数不返回值则会产生未定义行为。

## main 函数如果没有使用 return 语句则会隐式地返回 0

上述原则有一个特例，那就是main函数。main 函数如果没有使用 return 语句则会隐式地返回 0。即便如此，最佳实践仍然是显式地返回一个值，这样既能够表明你的实际意图，也能够在形式上和其他函数保持一致(可以预防你忽略其他函数的返回值)。

## 函数只能返回一个单值

具有返回值的函数依次只能返回一个单值给主调函数。

注意，`return`语句中的值不一定要素字面量——也可以是任何表达式的值，包括变量，甚至可以是其他函数的返回值。`getValueFromUser()` 的例子中，返回值是变量 `input`，其中包含了用户输入的实际值。

通过一些方法是可以绕过函数只能返回单一值的限制的，我们会在后续的课程中进行介绍。

## 函数的编写者可以决定返回值的含义

函数返回值的含义是由函数编写者决定的。有些函数会将状态码作为返回值来表示函数是否执行成功。有的函数则将计算结果或其他选定的值返回给主调函数。还有些函数什么都不返回（我们会在下一节课中介绍此类函数）。

因为函数返回值的含义可能是各种各样的，因此通过注释的方式对函数返回值的含义进行描述是一个很好的选择。例如： 

```cpp
// 函数提示用户输入一个值
// 返回值是用户从键盘输入的值，整型
int getValueFromUser()
{
     std::cout << "Enter an integer: ";
    int input{};
    std::cin >> input;

    return input; // 将用户数结果返回给主调函数
}
```

## 函数重用

接下来，介绍函数重用的典型例子，考虑下面这个程序：

```cpp
#include <iostream>

int main()
{
    int x{};
    std::cout << "Enter an integer: ";
    std::cin >> x;

    int y{};
    std::cout << "Enter an integer: ";
    std::cin >> y;

    std::cout << x << " + " << y << " = " << x + y << '\n';

    return 0;
}
```

虽然这个程序可以正常工作，但是代码有些冗余。实际上这个函数违反了好代码的核心信条：不要重复你自己——Don’t Repeat Yourself (常常缩写为DRY)。

为什么重复的代码是不好的？如果你想要将文本 “Enter an integer:” 修改成其他内容，那么你必须要修改两个地方。如果要初始化的变量有10个而不是两个呢？这无疑将会产生大量的冗余代码（使得程序变得又长又难以理解），还为拼写错误提供了滋生的空间。

下面，使用 `getValueFromUser` 函数来重构上述代码：

```cpp
#include <iostream>

int getValueFromUser()
{
     std::cout << "Enter an integer: ";
    int input{};
    std::cin >> input;

    return input;
}

int main()
{
    int x{ getValueFromUser() }; // first call to getValueFromUser
    int y{ getValueFromUser() }; // second call to getValueFromUser

    std::cout << x << " + " << y << " = " << x + y << '\n';

    return 0;
}
```

上述程序的输出结果如下：

```
Enter an integer: 5
Enter an integer: 7
5 + 7 = 12
```

上述程序中，`getValueFromUser`被调用了量词，一次用于初始化变量 `x`，一次用于初始化变量 `y`。使用该函数可以有效地避免重复代码，也减少了犯错的概率。只要 `getValueFromUser` 函数能够正确工作，那么便可以多次调用它。

这也是模块化编程的精髓：编写函数、测试函数以确保它能够正确工作，然后便可以在接下来的工作中反复使用该函数（只要我们没有修改这个函数——否则必须对该函数重新测试）。

!!! success "最佳实践"

	请遵循DRY原则，即不要"重复你自己的工作"。如果有件事需要做多次，请考虑是否可以修改代码，尽可能移除冗余的部分。变量可以用来存放被计算出来且需要多次使用的数据（这样就不需要进行重复计算）。函数可以用来定义一组可能会被多次执行的指令。循环（后面的章节中会介绍）则可以用来多次执行语句。

!!! cite "题外话"

	DRY 的反义词是 WET (“Write everything twice”——任何代码都写两遍).
