---
title: 12.7 - lambda表达式简介（匿名函数）
alias: 12.7 - lambda表达式简介（匿名函数）
origin: /chapter-12-comprehensive-quiz/
origin_title: "12.7 — Introduction to lambdas (anonymous functions)"
time: 2022-4-8
type: translation
tags:
- lambda
- C++14
- C++20
---

??? note "关键点速记"

请考虑下面这段代码，我们在 [[11-19-Introduction-to-standard-library-algorithms|11.19 — 标准库算法简介]]中介绍过它：

```cpp
#include <algorithm>
#include <array>
#include <iostream>
#include <string_view>

// Our function will return true if the element matches
bool containsNut(std::string_view str)
{
    // std::string_view::find returns std::string_view::npos if it doesn't find
    // the substring. Otherwise it returns the index where the substring occurs
    // in str.
    return (str.find("nut") != std::string_view::npos);
}

int main()
{
    std::array<std::string_view, 4> arr{ "apple", "banana", "walnut", "lemon" };

    // Scan our array to see if any elements contain the "nut" substring
    auto found{ std::find_if(arr.begin(), arr.end(), containsNut) };

    if (found == arr.end())
    {
        std::cout << "No nuts\n";
    }
    else
    {
        std::cout << "Found " << *found << '\n';
    }

    return 0;
}
```

这段代码会在一个数组中搜索字符串，找到第一个包含 “nut” 子串的元素。因此输出结果为：

```
Found walnut
```

虽然代码可以正确执行，但是还有可改进的地方。

这里问题的核心在于 `std::find_if` 要求使用者传递给它一个函数指针。因此，我们必须定义一个只使用一次的函数，还必须给它起个名，并将其放置在全局作用域中(因为函数不能嵌套!)。这个函数很短，从一行代码中几乎比从名称和注释中更容易辨别它的功能。

## lambda 

使用 lambda 表达式(有时候也称lambda或[[closure|闭包]]或匿名函数) 可以在其他函数中定义匿名函数。能够嵌套定义是很重要的特性，它可以避免[[namespace|命名空间]]中的名称污染，而且可以将函数的定义尽可能靠近使用它的地方（避免额外的上下文）。

lambda 的语法是C++中最奇怪的东西之一，需要一点时间来适应。匿名函数形式是:

```cpp
[ captureClause ] ( parameters ) -> returnType
{
    statements;
}
```

-   闭包语句可以为空，如果不需要捕获变量的话；
-   [[parameters|形参]]列表也可以为空，如果不需要形参的话；
-   返回类型是可选的，如果省略的话，会假定为 `auto` (使用[[type deduction|类型推断]]来决定返回值类型)。尽管我们之前说过，==应该避免使用函数返回值的类型推断==，但是在匿名表达式中是可以用的（因为这些函数通常都非常简单）。

因为lambda 没有函数名，所以不必为其起名。

!!! cite "题外话"

	一个基本的匿名函数定义看上去像是这样：
	
	```cpp
	#include <iostream>
	
	int main()
	{
	  [] {}; // 省略返回值类型, 无闭包，无参数
	  
	  return 0;
	}
	```


让我们用匿名函数重写上面的例子：

```cpp
#include <algorithm>
#include <array>
#include <iostream>
#include <string_view>

int main()
{
  constexpr std::array<std::string_view, 4> arr{ "apple", "banana", "walnut", "lemon" };

  // Define the function right where we use it.
  const auto found{ std::find_if(arr.begin(), arr.end(),
                           [](std::string_view str) // 匿名函数，无闭包
                           {
                             return (str.find("nut") != std::string_view::npos);
                           }) };

  if (found == arr.end())
  {
    std::cout << "No nuts\n";
  }
  else
  {
    std::cout << "Found " << *found << '\n';
  }

  return 0;
}
```

和使用函数指针的情况一样，产生相同的结果:

```
Found walnut
```

可以看到，lambda 和之前的 `containsNut` 函数非常类型。它们的参数和函数体是完全一样的。这个lambda没有闭包（下节课介绍），因为没必要。不仅如此我们还省略了返回值类型，但是由于 `operator!=` 返回 `bool`，所以该lambda也返回布尔类型。

## lambda 函数的类型

在上面的例子中，我们在需要的地方定义了匿名函数，它的这种用法有时被称为[[function-literal|函数字面量]]。

然而，在同一行中编写lambda有时会降低代码的可读性。就像我们可以用字面值(或函数指针)初始化一个变量以供以后使用一样，我们也可以用lambda定义初始化一个变量，然后在以后使用它。一个有好名字的lambda函数可以使代码更容易阅读。

例如，在下面的代码片段中，我们使用`std::all_of` 来检查数组中的所有元素是否为偶数：

```cpp
// Bad: We have to read the lambda to understand what's happening.
return std::all_of(array.begin(), array.end(), [](int i){ return ((i % 2) == 0); });
```

可以通过下面的方式提升可读性。

```cpp
// Good: Instead, we can store the lambda in a named variable and pass it to the function.
auto isEven{
  [](int i)
  {
    return ((i % 2) == 0);
  }
};

return std::all_of(array.begin(), array.end(), isEven);
```

注意，现在最后一行代码可以很自然地被理解为：*判断数组的所有元素是否都是偶数*

不过，`isEven` 的类型是什么呢？

事实证明，lambdas没有可以显式使用的类型。当我们编写lambda时，编译器会为其生成一个唯一的类型，但对我们并不可见。

!!! info "扩展阅读"

	实际上，lambda并不是函数(这是它们可以避免C++不支持嵌套函数的限制的部分原因)。它们是一种叫做functor的特殊对象。函子是包含重载的`operator()`的对象，使它们像函数一样可调用。
	
尽管我们并不知道lambda的类型，但是我们仍然有几种方法可以将其存放到某个变量中。如果一个lambda没有闭包，则可以使用一个普通的函数指针存放它。使用 `std::function` 或者通过 `auto` 进行类型推断也是可以的(即便此时lambda有闭包语句)。

```cpp
#include <functional>

int main()
{
  // A regular function pointer. Only works with an empty capture clause (empty []).
  double (*addNumbers1)(double, double){
    [](double a, double b) {
      return (a + b);
    }
  };

  addNumbers1(1, 2);

  // Using std::function. The lambda could have a non-empty capture clause (discussed next lesson).
  std::function addNumbers2{ // note: pre-C++17, use std::function<double(double, double)> instead
    [](double a, double b) {
      return (a + b);
    }
  };

  addNumbers2(3, 4);

  // Using auto. Stores the lambda with its real type.
  auto addNumbers3{
    [](double a, double b) {
      return (a + b);
    }
  };

  addNumbers3(5, 6);

  return 0;
}
```

使用lambda的实际类型的唯一方法是通过 `auto` 。与 `std::function` 相比，`auto` 还有一个好处，那就是没有开销。

不幸的是，在C++ 20之前，我们不能总是使用`auto` 。在实际lambda未知的情况下(例如，因为我们将lambda作为参数传递给函数，由调用者决定将传入什么lambda)，我们不能在这种情况下使用 `auto` 。在这种情况下，可以使用`std::function` 来代替。

```cpp
#include <functional>
#include <iostream>

// We don't know what fn will be. std::function works with regular functions and lambdas.
void repeat(int repetitions, const std::function<void(int)>& fn)
{
  for (int i{ 0 }; i < repetitions; ++i)
  {
    fn(i);
  }
}

int main()
{
  repeat(3, [](int i) {
    std::cout << i << '\n';
  });

  return 0;
}
```

输出

```
0
1
2
```

在这个例子中我们不能使用`auto` 关键字，这么做的话函数的调用者就无法知道`fn`应该有什么样的参数和返回值类型。这个限制在C++20引入[[abbreviated function templates|缩写函数模板]]之后就不存在了。

此外，因为它们实际上是模板，具有 `auto` 参数的函数不能被分离到头文件和源文件中。

!!! note "法则"

	需要用 lambda 初始化变量时，使用`auto`关键字。罪域不能用 lambda 初始化变量的场合，使用`std::function`。

## 泛型lambda函数

在大多数情况下，lambda形参的工作规则与常规函数形参相同。

一个值得注意的例外是，从C++ 14开始，我们允许使用`auto` 作为形参类型(注意:在c++ 20中，常规函数也可以使用 `auto` 作为形参类型)。当lambda有一个或多个 `auto` 形参时，编译器将从对lambda的调用中推断需要什么形参类型。

因为带有一个或多个 `auto` 参数的 lambda可以潜在地与各种类型一起工作，所以它们被称为泛型lambda。

!!! info "扩展阅读"

    当在lambda的上下文中使用时，`auto`只是模板形参的缩写。

看一个泛型lambda的例子：

```cpp
#include <algorithm>
#include <array>
#include <iostream>
#include <string_view>

int main()
{
  constexpr std::array months{ // pre-C++17 use std::array<const char*, 12>
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  };

  // Search for two consecutive months that start with the same letter.
  const auto sameLetter{ std::adjacent_find(months.begin(), months.end(),
                                      [](const auto& a, const auto& b) {
                                        return (a[0] == b[0]);
                                      }) };

  // Make sure that two months were found.
  if (sameLetter != months.end())
  {
    // std::next returns the next iterator after sameLetter
    std::cout << *sameLetter << " and " << *std::next(sameLetter)
              << " start with the same letter\n";
  }

  return 0;
}
```

输出：

```
June and July start with the same letter
```

在上面的例子中，我们使用了 `auto` 形参来获取字符串的 `const`引用。由于所有的字符串类型都可以通过 `operator[]` 访问单个字符。所以我们无需关心传入字符串是`std::string`、C风格字符串还是其他字符串。这样一来，我们就可以编写介绍这些类型的lambda表达式，如果将来需要修改 `months` 的类型，也不必修改lambda。

不过，使用 `auto` 并不总是最佳的选择，考虑下面代码：

```cpp
#include <algorithm>
#include <array>
#include <iostream>
#include <string_view>

int main()
{
  constexpr std::array months{ // pre-C++17 use std::array<const char*, 12>
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  };

  // Count how many months consist of 5 letters
  const auto fiveLetterMonths{ std::count_if(months.begin(), months.end(),
                                       [](std::string_view str) {
                                         return (str.length() == 5);
                                       }) };

  std::cout << "There are " << fiveLetterMonths << " months with 5 letters\n";

  return 0;
}
```

COPY

Output:

```
There are 2 months with 5 letters
```

In this example, using `auto` would infer a type of `const char*`. C-style strings aren’t easy to work with (apart from using `operator[]`). In this case, we prefer to explicitly define the parameter as a `std::string_view`, which allows us to work with the underlying data much more easily (e.g. we can ask the string view for its length, even if the user passed in a C-style array).

## 泛型lambda和静态变量

One thing to be aware of is that a unique lambda will be generated for each different type that `auto` resolves to. The following example shows how one generic lambda turns into two distinct lambdas:

```cpp
#include <algorithm>
#include <array>
#include <iostream>
#include <string_view>

int main()
{
  // Print a value and count how many times @print has been called.
  auto print{
    [](auto value) {
      static int callCount{ 0 };
      std::cout << callCount++ << ": " << value << '\n';
    }
  };

  print("hello"); // 0: hello
  print("world"); // 1: world

  print(1); // 0: 1
  print(2); // 1: 2

  print("ding dong"); // 2: ding dong

  return 0;
}
```

COPY

Output

```
0: hello
1: world
0: 1
1: 2
2: ding dong
```

In the above example, we define a lambda and then call it with two different parameters (a string literal parameter, and an integer parameter). This generates two different versions of the lambda (one with a string literal parameter, and one with an integer parameter).

Most of the time, this is inconsequential. However, note that if the generic lambda uses static duration variables, those variables are not shared between the generated lambdas.

We can see this in the example above, where each type (string literals and integers) has its own unique count! Although we only wrote the lambda once, two lambdas were generated -- and each has its own version of `callCount`. To have a shared counter between the two generated lambdas, we’d have to define a global variable or a `static` local variable outside of the lambda. As you know from previous lessons, both global- and static local variables can cause problems and make it more difficult to understand code. We’ll be able to avoid those variables after talking about lambda captures in the next lesson.

## 返回值类型推断和尾随返回值类型

If return type deduction is used, a lambda’s return type is deduced from the `return`-statements inside the lambda, and all return statements in the lambda must return the same type (otherwise the compiler won’t know which one to prefer).

For example:

```cpp
#include <iostream>

int main()
{
  auto divide{ [](int x, int y, bool intDivision) { // note: no specified return type
    if (intDivision)
      return x / y; // return type is int
    else
      return static_cast<double>(x) / y; // ERROR: return type doesn't match previous return type
  } };

  std::cout << divide(3, 2, true) << '\n';
  std::cout << divide(3, 2, false) << '\n';

  return 0;
}
```

COPY

This produces a compile error because the return type of the first return statement (int) doesn’t match the return type of the second return statement (double).

In the case where we’re returning different types, we have two options:

1.  Do explicit casts to make all the return types match, or
2.  explicitly specify a return type for the lambda, and let the compiler do implicit conversions.

The second case is usually the better choice:

```cpp
#include <iostream>

int main()
{
  // note: explicitly specifying this returns a double
  auto divide{ [](int x, int y, bool intDivision) -> double {
    if (intDivision)
      return x / y; // will do an implicit conversion of result to double
    else
      return static_cast<double>(x) / y;
  } };

  std::cout << divide(3, 2, true) << '\n';
  std::cout << divide(3, 2, false) << '\n';

  return 0;
}
```

COPY

That way, if you ever decide to change the return type, you (usually) only need to change the lambda’s return type, and not touch the lambda body.

## 标准库中的函数对象

For common operations (e.g. addition, negation, or comparison) you don’t need to write your own lambdas, because the standard library comes with many basic callable objects that can be used instead. These are defined in the [`<functional>`](https://en.cppreference.com/w/cpp/utility/functional#Operator_function_objects) header.

In the following example:

```cpp
#include <algorithm>
#include <array>
#include <iostream>

bool greater(int a, int b)
{
  // Order @a before @b if @a is greater than @b.
  return (a > b);
}

int main()
{
  std::array arr{ 13, 90, 99, 5, 40, 80 };

  // Pass greater to std::sort
  std::sort(arr.begin(), arr.end(), greater);

  for (int i : arr)
  {
    std::cout << i << ' ';
  }

  std::cout << '\n';

  return 0;
}
```

COPY

Output

```
99 90 80 40 13 5
```

Instead of converting our `greater` function to a lambda (which would obscure its meaning a bit), we can instead use `std::greater`:

```cpp
#include <algorithm>
#include <array>
#include <iostream>
#include <functional> // for std::greater

int main()
{
  std::array arr{ 13, 90, 99, 5, 40, 80 };

  // Pass std::greater to std::sort
  std::sort(arr.begin(), arr.end(), std::greater{}); // note: need curly braces to instantiate object

  for (int i : arr)
  {
    std::cout << i << ' ';
  }

  std::cout << '\n';

  return 0;
}
```

COPY

Output

```
99 90 80 40 13 5
```

## 小结

与使用循环的解决方案相比，匿名函数和算法库可能稍显得不必要地复杂。然而，这种组合可以在短短几行代码中实现一些非常强大的操作，并且比自己编写循环更具有可读性。最重要的是，算法库具有强大且易于使用的并行性，这是循环所无法获得的。更新使用库函数的源代码比更新使用循环的代码更容易。

匿名函数很好，但它们不能在所有情况下取代常规函数。对于功能复杂且需要可重用的情形，首选常规函数。