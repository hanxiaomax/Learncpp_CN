---
title: 4.15 - 符号常量 const 和 constexpr 变量
alias: 4.15 - 符号常量 const 和 constexpr 变量
origin: /const-constexpr-and-symbolic-constants/
origin_title: "4.15 -- Symbolic constants-const and constexpr variables"
time: 2022-5-24
type: translation
tags:
- const
- constexpr
- C++17
---

??? note "关键点速记"

    - const 变量必须初始化，且初始化之后值不可以改变
    - 任何在初始化后值就不能被改变，且初始化值可以在编译时确定的变量，都必须声明为 `constexpr`
    - constexpr 不能被定义在其他文件中然后通过前向声明使用，这样编译器就无法在编译时得到它的值
    - 任何在初始化后值就不能被改变，但是初始化值不能在编译时确定的变量，都应该声明为 `const`
    - 字面量是隐式的 `constexpr`，因为字面量的值在编译时就可以确定
    - 常数表达式指的是可以在运行时求值得到结果的表达式
    - C++17 和之前的版本不支持 `constexpr std:: string` ，只有在 C++20 中才有有限的的支持。如果你想要使用 `constexpr strings`，应该用 `std:: string_view` 代替
    - 避免使用 `#define` 来创建符号常量宏。使用 const 或者 constexpr
    - 只有当一个数字（也可能是其他类型）含义不明确或多次被使用时才被看做是魔术数字。有些场合下的字面量，尤其是只使用一次的字面量，可以不被看做是魔术数字
    - 使用常量来避免魔术数字

## Const 变量

到目前为止，我们看到的所有变量都是“非常量”——也就说它们的值可以在任何时间被改变，例如：

```cpp
int x { 4 }; // initialize x with the value of 4
x = 5; // change value of x to 5
```

不过，有时候需要将变量定义为不能改变。例如，地球的引力是 `9.8 meters/second^2`，这个值不太可能会随时改变（如果真的会随时改变的话，你应该担心的就不是 C++了）。所以将这个值定义为常量可以确保它不会被意外改变。

将变量定义为常量，只需要在类型前面或后面添加 `const` 关键字，例如：

```cpp
const double gravity { 9.8 };  // preferred use of const before type
int const sidesInSquare { 4 }; // "east const" style, okay, but not preferred
```

尽管 C++ 允许你在类型前面或者后面添加 ` const` 关键字，我们还是推荐你把它放在类型前面，这样看上去更像是正常的英语语法。

const 类型的变量通常被称为符号常量（与之相对的是字符串常量，字符串常量是没有名字的）。

## Const 变量必须初始化

const 变量**必须**在定义时初始化，此后你也不能通过赋值来改变它：

```cpp
int main()
{
    const double gravity; // error: const variables must be initialized
    gravity = 9.9; // error: const variables can not be changed

    return 0;
}
```

注意，const 变量可以使用其他类型的变量初始化（包括非 const 类型的变量）：

```cpp
#include <iostream>

int main()
{
    std::cout << "Enter your age: ";
    int age{};
    std::cin >> age;

    const int usersAge { age };

    // age is non-const and can be changed
    // usersAge is const and can not be changed

    std::cout << usersAge;

    return 0;
}
```

## 运行时常量和编译时常量

C++ 实际上有两种类型的常量。

[[runtime|运行时]]常量的初始化值必须在运行时才能解析（当程序运行时），下面的例子展示了运行时常量：

```cpp
#include <iostream>

void printInt(const int x) // x is a runtime constant because the value isn't known until the program is run
{
    std::cout << x;
}

int main()
{
    std::cout << "Enter your age: ";
    int age{};
    std::cin >> age;

    const int usersAge { age }; // usersAge is a runtime constant because the value isn't known until the program is run

    std::cout << "Your age is: ";
    printInt(usersAge);

    return 0;
}
```

上面程序中的 `usersAge` 和 `x` 这样的变量，就是运行时常量，因为编译器不能确定它们的初始值，必须等到程序运行时才能确定。`usersAge` 的值依赖用户的输入（只有在运行时才能获取输入）而 `x` 的值依赖于传入函数的值（也只有在程序运行时才知道）。不过，一旦这些值被初始化之后，它们的值就不能再改变了。

编译时常量的初始化值，可以在[[compile-time|编译时]]就确定。下面的例子展示了编译时常量：

```cpp
const double gravity { 9.8 }; // the compiler knows at compile-time that gravity will have value 9.8
const int something { 1 + 2 }; // the compiler can resolve this at compiler time
```

编译时常量可以使编译器进行编译优化，这是运行时常量做不到的。例如，每当使用 `gravity` 的时候，编译器可以直接将其替换为字面量 9.8。

当你声明一个 const 变量的时候，编译器会自动追踪并判断它是运行时常量还是编时常量。在大多数情况下，是什么并没有关系，但是有少数情况 C++ 要求必须使用一个编译时常量而非运行时常量（我们会在后面介绍这种情况）。

## constexpr

为了能够更加确切，C++引入了关键字 **constexpr**，它可以确保一个常量是编译时常量：

```cpp
#include <iostream>

int main()
{
    constexpr double gravity { 9.8 }; // ok, the value of 9.8 can be resolved at compile-time
    constexpr int sum { 4 + 5 }; // ok, the value of 4 + 5 can be resolved at compile-time

    std::cout << "Enter your age: ";
    int age{};
    std::cin >> age;

    constexpr int myAge { age }; // 编译错误: age 是一个运行时常量而不是编译时常量

    return 0;
}
```

!!! success "最佳实践"

    任何在初始化后值就不能被改变，且初始化值可以在编译时确定的变量，都必须声明为 `constexpr`。
    任何在初始化后值就不能被改变，但是初始化值不能在编译时确定的变量，都应该声明为 `const`。


在现实中，程序员通常懒得将一个简单函数中的局部变量定义为 `const` 类型，因为这些局部变量被不小心修改的可能性并不大。

注意，字面量是隐式的 `constexpr`，因为字面量的值在编译时就可以确定。

## 常量表达式

常量表达式指的是可以在运行时求值得到结果的表达式，例如：

```cpp
#include <iostream>

int main()
{
    std::cout << 3 + 4; // 3 + 4 evaluated at compile-time

    return 0;
}
```

在上面的程序中，字面量 3 和 4 在编译时就指定，所以编译器可以对表达式 `3+4` 求值，然后替换成 7。这么做可以使代码运行速度加快，因为表达式 `3+4` 无需在运行时求值了。

Constexpr 变量也可以被用在常量表达式中：

```cpp
#include <iostream>

int main()
{
    constexpr int x { 3 };
    constexpr int y { 4 };
    std::cout << x + y; // x + y evaluated at compile-time

    return 0;
}
```

在上面的例子中，因为 `x` 和 `y` 都是 `constexpr`，所以表达式 `x + y` 也是一个常量表达式，它的结果也可以在爱编译时求出。和字面量的例子一样，编译器会把它替换成 7。

## Constexpr 字符串

如果你尝试定义 `constexpr std:: string`，你的编译器可能会报错 ：

```cpp
#include <iostream>
#include <string>

using namespace std::literals;

int main()
{
    constexpr std::string name{ "Alex"s }; // compile error

    std::cout << "My name is: " << name;

    return 0;
}
```

这是因为在 C++17 或之前的版本中还不支持 `constexpr std:: string` ，只有在 C++20 中才有有限的的支持。如果你想要使用 `constexpr strings`，应该用 `std:: string_view` 代替：

```cpp
#include <iostream>
#include <string_view>

using namespace std::literals;

int main()
{
    constexpr std::string_view name{ "Alex"sv }; // ok: std::string_view can be constexpr

    std::cout << "My name is: " << name;

    return 0;
}
```


!!! info "相关内容"

    我们会在[[11-7-An-introduction-to-std-string_view|11.7 - std:: string_view 简介]] 中介绍 `std:: string_view`

## const 变量的命名

有些程序员喜欢用全大写字母来命名  const 变量。而有些程序员则喜欢使用普通变量名加 `k` 前缀。本课程会使用普通变量名的命名方法。const 变量在各种情况下都和普通变量具有一样的表现，只是它们的值不能被修改而已，因此我们也没有必要对其进行特别地命名。

## Const 类型的函数形参和返回值

const 类型也可以用于函数形参：

```cpp
#include <iostream>

void printInt(const int x)
{
    std::cout << x;
}

int main()
{
    printInt(5); // 5 will be used as the initializer for x
    printInt(6); // 6 will be used as the initializer for x

    return 0;
}
```

将函数的形参定义为 `const` 类型，可以借助编译器来确保该参数的值再函数中不会被修改。注意，在上面的例子中我们并没有为 `const` 参数提供一个初始化值——在这个例子中，传递给函数的实参被用作初始化值。

当使用[[pass-by-value|按值传递]]的方式传递实参是，我们通常不会在意函数中是否修改了该才是（毕竟它只是一份拷贝，而且在函数退出时就销毁了）。出于这个原因，通常我们不会把值传递的形参定义为 `const`。 但是，稍后我们会介绍另外一种类型的形参（改变形参会改变创的实参）。对于这种类型的形参，将其定义为 `const` 类型还是很重要的。

!!! success "最佳实践"

    函数的形参按值传递时，没必要定义为 const。

函数的返回值也可以被定义为 `const`：

```cpp
#include <iostream>

const int getValue()
{
    return 5;
}

int main()
{
    std::cout << getValue();

    return 0;
}
```

不过，由于返回值只是拷贝，因此也没必要定义为 `const`。

!!! success "最佳实践"

    不要将返回值定义为 `const`。

## 避免将对象形式的预处理器宏用于符号常量

在[[2-10-Introduction-to-the-preprocessor|2.10 - 预处理器简介]]中，我们介绍了[[object-like-macros|对象类型的宏]]有两种形式——一种用于替换，一种不用于替换。这里我们会讨论一下用于替换的宏，它的形式如下：

```
#define identifier substitution_text
```

每当[[preprocessor|预处理器]]遇到该指令时，后续所有 `identifier` 都会被替换为 `substitution_text`。这里的 `identifier` 通常会使用全大写形式并使用下划线代替空格。

考虑下面的代码片段：

```cpp
#define MAX_STUDENTS_PER_CLASS 30
int max_students { numClassrooms * MAX_STUDENTS_PER_CLASS };
```

当你编译代码时，预处理器就会把 `MAX_STUDENTS_PER_CLASS` 替换为字面量 30，然后被编译到可执行文件中。

所以，为什么不用 `#define` 定义符号常量呢？这里有（至少）三个主要问题。

首先，因为宏的解析是预处理器负责的，所以所有的替换都发生在编译之前。当你调试代码的时候，你无法看到实际的值（例如 30），而只能看到该符号常量的名字(例如 `MAX_STUDENTS_PER_CLASS`)。而且，因为这些宏定义并不是变量，所以再调试器中你没法对其值进行监控。 如果你想要指定 `MAX_STUDENTS_PER_CLASS` 解析后的值是多少，你必须取找到 `MAX_STUDENTS_PER_CLASS` 的定义才行(该定义还可能是在别的文件中)。这样就会使你的程序难以调试。

另外，宏和普通代码可能会产生命名冲突，例如：

```cpp
#include "someheader.h"
#include <iostream>

int main()
{
    int beta { 5 };
    std::cout << beta;

    return 0;
}
```

如果 `someheader.h` 恰好 `#define` 了一个名为 _beta_ 的宏，那么这个程序就无法编译，因为预处理器会把 `int` 变量的名字替换掉。通常，使用全大写的宏名可以避免此类问题，但并无法完全杜绝。

第三，宏并不遵循正常的作用域规则，这意味着定极少数情况下，定义在函数某部分的宏可能会和其他部分的代码发生冲突。

!!! warning "注意"

    避免使用 `#define` 来创建符号常量宏。使用 const 或者 constexpr。

## 在多个文件中共用符号常量

在很多应用程序中，有些符号常量需要被所有的代码使用（而不仅仅是被局部的代码使用）。这些变量可能是物理常量或数学常量（例如 π 或阿伏伽德罗常数），或者是某个应用程序需要的参数（例如摩擦系数或引力系数）。与其在多个文件中各定义一遍这些变量，不如将它们集中定义在一个地方然后按需使用。这样，万一你需要修改它们的值，你只需要在一处修改即可。

在 C++ 中有很多方法可以实现上述需求，我们会在 [[6-9-Sharing-global-constants-across-multiple-files-using-inline-variables|6.9 - 使用 inline 变量共享全局常量]] 中进行详细的介绍。

## 使用常量来避免“魔术数字”

魔术数字指的是含义不清或多次使用的字面量（通常是数字）。

下面代码展示了一种含义不清的魔术数字：

```cpp
constexpr int maxStudentsPerSchool{ numClassrooms * 30 };
```

这里的 30 到底是什么含义？尽管有时候你可能可以猜到它的含义，例如这里指的是每个教室最多的学生数，但是这个意义并不明显。对于更加复杂的程序来说，推测某个硬编码的数字是很难的，除非有注释。

幸运的是，我们可以使用符号常量来避免这种含义不清的魔术数字：

```cpp
constexpr int maxStudentsPerClass { 30 }; // now obvious what 30 is
constexpr int maxStudentsPerSchool{ numClassrooms * maxStudentsPerClass };
```

使用魔术数字通常被认为是一种不好的编码习惯，它们不仅没有提供关于其用途的上下文信息，而且还留下了一个隐患（万一需要修改则需要在多处修改）。假设，学校购买了一些新的课桌，现在一个教室能够容纳 35 人了，那么我们的程序也必须反映这一情况。考虑如下代码：

```cpp
constexpr int maxStudents{ numClassrooms * 30 };
setMax(30);
```

为了修改程序适应新的情况，我们必须把常量 30 修改为 35，但是 `setMax()` 怎么办？它的参数 30 和其他 30 是一个意思吗？应该更新还是应该保留啊，搞不好会导致程序出问题的。如你进行全局的查找和替换，那么你可能会替换掉本不应该被更新的 `setMax()` 中的 30。所以你可能需要逐个检查每一个 30，确保它应该被替换才执行操作。这就太费时间（而且还容易出错）。

下面的代码 (使用符号常量) 则更加清晰，明显可以看出两个 30 是不是一回事：

```cpp
constexpr int maxStudentsPerClass { 30 }; // now obvious what 30 is
constexpr int totalStudents{ numClassrooms * maxStudentsPerClass };

constexpr int maxNameLength{ 30 };
setMax(maxNameLength); // now obvious this 30 is used in a different context
```

魔术数字并不总是数字——也可能是字符串或其他类型。

注意，只使用一次，且含义明确的[[literals|字面量]]通常不被认为是魔术数字。像-1、0、0.0 和 1这样的值就经常被用在含义非常明确的情境中：

```cpp
int idGenerator { 0 };         // fine: we're starting our id generator with value 0
idGenerator = idGenerator + 1; // fine: we're just incrementing our generator
```

其他值在某些语境下含义也是明显的 (因此也可以不被看做是魔术数字)：

```cpp
int kmtoM(int km) { return km * 1000; } // 可以这么做: 很显然这里1000是km和m之间的转换系数
```

!!! success "最佳实践"

    在代码中避免魔术数字 (使用常量来代替)。
