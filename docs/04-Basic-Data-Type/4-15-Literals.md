---
title: 4.15 - 字面量
alias: 4.15 - 字面量
origin: /literals/
origin_title: "4.14 — Literal"
time: 2022-6-17
type: translation
tags:
- literal
- constants
- C++14
---

??? note "Key Takeaway"

	- 常量有两种，字面量常量（简称字面量）和符号常量
	- 字面量的类型具有默认值，可以通过后缀修改
		- 小数字面量的默认类型为double而不是float
		- C风格的字符串，默认类型为字符数组
	- `std::string`和`std::string_view`类型的字面量可以通过`s`和`sv`后缀指定，在类型推断时比较有用，其他情况一般不需要
	- 声明浮点数字面量的方法有两种：`3.14159`或`1.9e10`
	- 只有当一个数字（也可能是其他类型）含义不明确或多次被使用时才被看做是魔术数字。有些场合下的字面量，尤其是只使用一次的字面量，可以不被看做是魔术数字
	- 使用常量来避免魔术数字
	

字面量常量（通常称为[[literals|字面量]]） 指的是直接嵌入到代码中的未命名的值，例如：

```cpp
return 5; // 5 是一个整型字面量
bool myNameIsAlex { true }; // true 是一个布尔字面量
std::cout << 3.4; // 3.4 是一个 double 字面量
```


字面量通常被称为**字面量常量**，因为你不能动态地改变它们的值


## 字面量的类型

和其他对象诶新一样，所有的字面量也有其类型。字面量的类型由其值和字面量本身的格式推定。

默认情况下：

|字面量值|例子	|默认类型|
|----|----|----|
|integral value|	5, 0, -3	|int
|boolean value	|true, false|	bool
|floating point value	|3.4, -2.2	|double (不是 float)!
|char value	|‘a’	|char
|C-style string	|“Hello, world!”	|const char[14]


## 字面量后缀

如果默认类型不是你想要的，可以通过字面量的后缀改变其类型：

|数据类型	|后缀	|含义|
|----|----|----|
|int	|u or U	|unsigned int|
|int	|l or L	|long|
|int	|ul, uL, Ul, UL, lu, lU, Lu, or LU	|unsigned long|
|int	|ll or LL	|long long|
|int	|ull, uLL, Ull, ULL, llu, llU, LLu, or LLU	|unsigned long long|
|double	|f or F	|float|
|double	|l or L	|long double|

后缀是区分大小写的，但是由于小写字母`L`看起来很像 1 ，所以开发者通常喜欢用大写。

!!! info "相关内容"

我们会在[[4-17-an-introduction-to-std-string|4.17 - std::string 简介]] 和[[4-18-Introduction-to-std-string_view|4.18 - std::string_view 简介]]中讨论字符串字面量的后缀。


## 整型字面量

通常情况下，你不需要为整型指定后缀，但是如果要做的话，可以参考下面例子：

```cpp
#include <iostream>

int main()
{
    std::cout << 5; // 5 (no suffix) is type int (by default)
    std::cout << 5L; // 5L is type long

    return 0;
}
```

`u` (或者 ‘U’) 是一个特例，通常用来标记无符号整型字面量：

```cpp
#include <iostream>

int main()
{
    unsigned int x { 5u }; // 5u is type unsigned int
    std::cout << x;

    return 0;
}
```

## 浮点数字面量

默认情况下，浮点数字面量的类型为 `double`，如果希望使用 `float` 类型，则需要指定 `f`或`F`后缀：

```cpp
std::cout << 5.0; // 5.0 (no suffix) is type double (by default)
std::cout << 5.0f; // 5.0f is type float
```


新程序员通常会奇怪为什么下面的代码会导致编译告警：

```cpp
float f { 4.1 }; // warning: 4.1 是 double 类型的字面量而不是 float 类型
```


因为，4.1 没有后缀所以是 `double` 类型的字面量，而不是 `float` 类型。当C++定义字面量的类型时，它不在乎该字面量的用途（例如，在这个例子中是用于初始化一个 `float` 变量）。因此，4.1 必须被转换为 `double` 类型才可以被赋值给变量 `f`，而这么做是会导致精度丢失的。

在C++中，只要字面量的意思是清晰的，那么你可以放心使用。例如大多数情况下会使用字面量进行初始化或赋值、数学运算或直接打印到屏幕上。


## 字符串字面量

在 [[4-11-Chars|4.11 - 字符]] 中我们将字符串定义为一个字符序列的集合。在 C++ 中也支持字符串字面量：

```cpp
std::cout << "Hello, world!"; // "Hello, world!" is a C-style string literal
std::cout << "Hello," " world!"; // C++ 会链接字符串字面量
```

出于某些历史原因，C++ 处理字符串的方式有些特别。目前来讲，你可以使用字符串字面量来作为打印文本或用于初始化 `std::string`。

> [!info] "扩展阅读"
> C++ 同样也支持 std::string 和 std::string_view 字面量。虽然在很多时候并不需要使用它们，但是在使用类型推断的时候，它们还是挺有用的。类型推断可以发生在使用 `auto`关键字（[[8-7-Type-deduction-for-objects-using-the auto-keyword|8.7 - 使用 auto 关键字进行类型推断]]）或是在类模板参数推断时。

> ```cpp
> #include <iostream>
> #include <string>      // for std::string
> #include <string_view> // for std::string_view
> 
> int main()
> {
>     using namespace std::literals; // easiest way to access the s and sv suffixes
> 
>     std::cout << "foo\n";   // no suffix is a C-style string literal
>     std::cout << "goo\n"s;  // s 后缀表示 std::string 字面量
>     std::cout << "moo\n"sv; // sv 后缀表示 a std::string_view 字面量
> 
>     return 0;
> };
> ```

> 此处使用`using`来引入整个命名空间是一个被允许的特例。

我们会在后续的课程中深入讨论字符串字面量。

## 浮点数字面量的科学计数法表示

声明浮点数字面量的方法有两种：

```cpp
double pi { 3.14159 }; // 3.14159 是 double 类型字面量
double avogadro { 6.02e23 }; // 6.02 x 10^23 是 double 类型，科学计数法表示
```

对于科学计数法来讲，指数部分也可以是负值：

```cpp
double electron { 1.6e-19 }; // charge on an electron is 1.6 x 10^-19
```



## 魔术数字

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

> [!success] "最佳实践"
> 在代码中避免魔术数字 (使用常量来代替)。