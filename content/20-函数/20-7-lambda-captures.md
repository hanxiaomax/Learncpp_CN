---
title: 12.8 - lambda 闭包
alias: 12.8 - lambda 闭包
origin: /lambda-captures/
origin_title: "12.8 — Lambda captures"
time: 2022-9-16
type: translation
tags:
- summary
---

> [!note] "Key Takeaway"


## 捕获语句以及捕获值

在上节课 [[20-6-introduction-to-lambdas-anonymous-functions|12.7 - lambda表达式简介]]) 中我们介绍了整个例子：

```cpp
#include <algorithm>
#include <array>
#include <iostream>
#include <string_view>

int main()
{
  std::array<std::string_view, 4> arr{ "apple", "banana", "walnut", "lemon" };

  auto found{ std::find_if(arr.begin(), arr.end(),
                           [](std::string_view str)
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


接下来，修改这个例子，让用户决定需要搜索的子串。不过，这个操作并不想你想象的那么简单：

```cpp
#include <algorithm>
#include <array>
#include <iostream>
#include <string_view>
#include <string>

int main()
{
  std::array<std::string_view, 4> arr{ "apple", "banana", "walnut", "lemon" };

  // Ask the user what to search for.
  std::cout << "search for: ";

  std::string search{};
  std::cin >> search;

  auto found{ std::find_if(arr.begin(), arr.end(), [](std::string_view str) {
    // 搜索 @search 而不是 "nut".
    return (str.find(search) != std::string_view::npos); // 错误: search 并不能在这里被访问
  }) };

  if (found == arr.end())
  {
    std::cout << "Not found\n";
  }
  else
  {
    std::cout << "Found " << *found << '\n';
  }

  return 0;
}
```

这段代码无法编译。与嵌套块(在嵌套块范围内可以访问外部块中定义的任何标识符)不同，==lambdas只能访问特定类型的标识符：全局变量、编译时已知的实体和具有[[static-storage-duration|静态存储持续时间]]的实体==。`search` 不满足这些要求，所以lambda无法看到它。这就是捕获语句的作用。

## 闭包

捕获语句用于为帮助 lambda 访问在其内部无法访问的普通变量。我们要做的就是将需要访问的实体列举在捕获语句中。在本例中，我们需要让lambda访问 `search` 变量，所以将其加入捕获语句即可：

```cpp
#include <algorithm>
#include <array>
#include <iostream>
#include <string_view>
#include <string>

int main()
{
  std::array<std::string_view, 4> arr{ "apple", "banana", "walnut", "lemon" };

  std::cout << "search for: ";

  std::string search{};
  std::cin >> search;

  // Capture @search                                vvvvvv
  auto found{ std::find_if(arr.begin(), arr.end(), [search](std::string_view str) {
    return (str.find(search) != std::string_view::npos);
  }) };

  if (found == arr.end())
  {
    std::cout << "Not found\n";
  }
  else
  {
    std::cout << "Found " << *found << '\n';
  }

  return 0;
}
```


注意，这样用户就可以在数组中搜索任何值了：

输出：

```
search for: nana
Found banana
```

## 闭包是如何工作的？

虽然上面例子中的lambda看起来像是直接访问了main函数中的`search` 变量，但事实并非如此。虽然 lambda 可能看起来像嵌套块，但它们的工作方式略有不同(而且这种区别很重要)。

当执行lambda定义时，对于lambda捕获的每个变量，将在lambda内部生成该变量的克隆(具有相同的名称)。此时，这些克隆变量是从同名的外部作用域变量初始化的。

因此，在上面的例子中，当lambda对象被创建时，lambda将获得自己的克隆变量 `search`。这个克隆的 `search` 与 main 函数中的 `search` 具有相同的值，因此它的行为就像访问 main 函数中的 `search` 一样，但实际上并不是。

虽然这些克隆的变量具有相同的名称，==但它们不一定具有与原始变量相同的类型==。我们将在本课接下来的章节中探讨这个问题。


> [!tldr] "关键信息"
> 捕获的变量是外层原始变量的一份克隆，而不是实际的原变量。
	
> [!info] "扩展阅读"
> 尽管 lambda 看上去像是函数，但其实并不是，它只是可以被像函数一样调用的对象而已(称为 functor —— 我们会在后面的课程中介绍如何定义自己的functor的)。

当编译器遇到lambda定义时，它为该lambda创建一个自定义对象定义。每个捕获的变量都会成为对象的数据成员。

在运行时，当遇到lambda定义时，将实例化lambda对象，并在此时初始化lambda的成员。


## 默认捕获的是const值

默认情况下，变量被捕获为 const 值。这意味着在创建lambda时，lambda捕获外部作用域变量的const副本，这意味着不允许lambda修改它们。在下面的例子中，我们捕获变量`ammo`并尝试递减它。

```cpp
#include <iostream>

int main()
{
  int ammo{ 10 };

  // 定义一个 lambda 并将其存放在 "shoot" 中
  auto shoot{
    [ammo]() {
      // 非法操作, ammo 是const的
      --ammo;

      std::cout << "Pew! " << ammo << " shot(s) left.\n";
    }
  };

  // Call the lambda
  shoot();

  std::cout << ammo << " shot(s) left\n";

  return 0;
}
```


在上面的例子中，由于捕获的 `ammo` 是`const`变量。所以并不能被修改，否则编译器会报错。

## 捕获变量设置为可变值

为了允许修改被捕获的变量，我们可以将lambda标记为 `mutable` 。在此上下文中，`mutable` 关键字从按值捕获的全部变量中删除 const 限定。

```cpp
#include <iostream>

int main()
{
  int ammo{ 10 };

  auto shoot{
    // 在参数列表后面添加 mutable 关键字
    [ammo]() mutable {
      // 现在可以修改 ammo 了
      --ammo;

      std::cout << "Pew! " << ammo << " shot(s) left.\n";
    }
  };

  shoot();
  shoot();

  std::cout << ammo << " shot(s) left\n";

  return 0;
}
```

输出结果：

```
Pew! 9 shot(s) left.
Pew! 8 shot(s) left.
10 shot(s) left
```

虽然代码可以编译，但是存在逻辑错误。为什么会这样？当lambda被调用时，它捕获的是 `ammo` 的副本，尽管 lambda 将 `ammo` 从 `10` 递减到 `9` 再到 `8`，但是它递减的是其拷贝，而不是原本的值。

注意，`ammo` 的值会在多次lambda调用直接保持！

> [!warning] "注意"
> 因为捕获的变量是lambda对象的成员，所以它们的值跨多次调用lambda!

## 捕获变量的引用

就像函数可以通过引用来更改参数的值一样，我们也可以通过引用来捕获变量，以允许lambda修改参数的值。

要通过引用捕获变量，需要在捕获的变量名前加上`&`号。与通过值捕获的变量不同，通过引用捕获的变量是非const的，除非它们捕获的变量是 `const` 。当你通常喜欢通过引用将参数传递给函数时(例如，对于非基本类型)，通过引用捕获应该优先于通过值捕获。

修改之前的例子，捕获 `ammo` 的引用：

```cpp
#include <iostream>

int main()
{
  int ammo{ 10 };

  auto shoot{
    // We don't need mutable anymore
    [&ammo]() { // &ammo means ammo is captured by reference
      // Changes to ammo will affect main's ammo
      --ammo;

      std::cout << "Pew! " << ammo << " shot(s) left.\n";
    }
  };

  shoot();

  std::cout << ammo << " shot(s) left\n";

  return 0;
}
```

结果如我们期望的那样：

```
Pew! 9 shot(s) left.
9 shot(s) left
```

接下来，我们使用按引用捕获来统计 `std::sort` 对数组排序时进行的比较次数。

```cpp
#include <algorithm>
#include <array>
#include <iostream>
#include <string>

struct Car
{
  std::string make{};
  std::string model{};
};

int main()
{
  std::array<Car, 3> cars{ { { "Volkswagen", "Golf" },
                             { "Toyota", "Corolla" },
                             { "Honda", "Civic" } } };

  int comparisons{ 0 };

  std::sort(cars.begin(), cars.end(),
    // Capture @comparisons by reference.
    [&comparisons](const auto& a, const auto& b) {
      // We captured comparisons by reference. We can modify it without "mutable".
      ++comparisons;

      // Sort the cars by their make.
      return (a.make < b.make);
  });

  std::cout << "Comparisons: " << comparisons << '\n';

  for (const auto& car : cars)
  {
    std::cout << car.make << ' ' << car.model << '\n';
  }

  return 0;
}
```

可能的输出是：

```
Comparisons: 2
Honda Civic
Toyota Corolla
Volkswagen Golf
```

## 捕获多个变量


可以通过用逗号分隔多个变量来捕获它们。这其中可以包括通过值或引用捕获的变量的组合：

```cpp
int health{ 33 };
int armor{ 100 };
std::vector<CEnemy> enemies{};

// Capture health and armor by value, and enemies by reference.
[health, armor, &enemies](){};
```



## 默认捕获

必须显式地列出想要捕获的变量是很麻烦的。如果修改lambda，可能会忘记添加或删除捕获的变量。幸运的是，我们可以利用编译器的帮助来自动生成需要捕获的变量列表。

默认捕获(也称为capture-default)捕获lambda中提到的所有变量，但不会捕获lambda中未提及的变量。

- 按值捕获所有使用的变量，使用捕获值`=` ；
- 按引用捕获所有使用的变量，请使用捕获值 `&`。


下面是一个使用默认值捕获的例子：

```cpp
#include <algorithm>
#include <array>
#include <iostream>

int main()
{
  std::array areas{ 100, 25, 121, 40, 56 };

  int width{};
  int height{};

  std::cout << "Enter width and height: ";
  std::cin >> width >> height;

  auto found{ std::find_if(areas.begin(), areas.end(),
                           [=](int knownArea) { // will default capture width and height by value
                             return (width * height == knownArea); // because they're mentioned here
                           }) };

  if (found == areas.end())
  {
    std::cout << "I don't know this area :(\n";
  }
  else
  {
    std::cout << "Area found :)\n";
  }

  return 0;
}
```



默认捕获可以与普通捕获混合使用。我们可以通过值捕获一些变量，通过引用捕获另一些变量，但是每个变量只能捕获一次。

```cpp
int health{ 33 };
int armor{ 100 };
std::vector<CEnemy> enemies{};

// 按值捕获 health 和 armor ，按引用捕获 enemies 
[health, armor, &enemies](){};

// 按引用捕获 enemies，剩下的都按值捕获
[=, &enemies](){};

// 按值捕获 armor，剩下的都按引用捕获
[&, armor](){};

// 错误：已经表明按引用捕获所有变量
[&, &armor](){};

// 错误：已经表明按值捕获所有变量
[=, armor](){};

// 错误：armor 出现了两次
[armor, &health, &armor](){};

// 错误：默认捕获必须放在最前面
[armor, &](){};
```


## 在闭包中定义新的变量

有时候我们需要对捕获的变量进行稍许修改，或者是声明一个仅在 lambda 作用域中可见的变量，此时我们可以在闭包中定义一个新的变量而且不必指明其类型。

```cpp
#include <array>
#include <iostream>
#include <algorithm>

int main()
{
  std::array areas{ 100, 25, 121, 40, 56 };

  int width{};
  int height{};

  std::cout << "Enter width and height: ";
  std::cin >> width >> height;

  // 我们需要面积，但是用户输入的是长宽。
  // 所以需要在搜索面积前首先计算面积
  auto found{ std::find_if(areas.begin(), areas.end(),
                           // 声明一个仅 lambda 可见的变量
                           // userArea 会被自动推断为 int.
                           [userArea{ width * height }](int knownArea) {
                             return (userArea == knownArea);
                           }) };

  if (found == areas.end())
  {
    std::cout << "I don't know this area :(\n";
  }
  else
  {
    std::cout << "Area found :)\n";
  }

  return 0;
}
```


当lambda被定义时，`userArea` 只会被计算一次。计算的面积存储在lambda对象中，每次调用都是相同的。如果lambda是可变的，并且修改了捕获中定义的变量，则原始值将被覆盖。


> [!success] "最佳实践"
> 只有当变量的存在时间很短且类型很明显时，才在捕获中的定义并初始化变量。否则，最好在lambda之外定义变量并捕获它。

## 悬垂的捕获变量

变量在定义lambda的地方被捕获。如果引用捕获的变量在lambda之前被销毁，则lambda将得到一个[[dangling|悬垂]]引用。

例如：

```cpp
#include <iostream>
#include <string>

// 返回一个 lambda
auto makeWalrus(const std::string& name)
{
  // 按引用捕获 name 并返回一个lambda
  return [&]() {
    std::cout << "I am a walrus, my name is " << name << '\n'; // 未定义行为
  };
}

int main()
{
  // 创建一个名为roofus的新的 walrus 
  // sayName 是 makeWalrus 返回的 lambda
  auto sayName{ makeWalrus("Roofus") };

  // 调用 makeWalrus 返回的 lambda 
  sayName();

  return 0;
}
```


调用 `makeWalrus` 会从字符串字面量“Roofus”创建一个临时的 `std::string` 。`makeWalrus` 中的lambda会按引用捕获该字符串。当 `makeWalrus` 返回时，该字符串会销毁，但是 lambda 仍然会使用它的引用。于是当我们调用 `sayName` 时，就会访问该悬垂引用，导致[[undefined-behavior|未定义行为]]。

注意，即使 `name` 是[[pass-by-value|按值传递]]给 `makeWalrus` 的。变量 `name` 仍然会在 `makeWalrus` 结束时销毁，lambda持有的仍然是悬垂引用。

> [!warning] "注意"
> 在通过引用捕获变量时要格外小心，特别是使用默认引用捕获时。捕获的变量必须比lambda存活的时间长。

如果我们想要在使用lambda时仍然保证 `name` 可用，则需要在闭包中按值捕获该变量（显式指定或默认按值捕获）。

## 无意间拷贝可变的 lambda 

因为lambda是对象，所以它们可以被复制。在某些情况下，这可能会导致问题。考虑以下代码:

```cpp
#include <iostream>

int main()
{
  int i{ 0 };

  // Create a new lambda named count
  auto count{ [i]() mutable {
    std::cout << ++i << '\n';
  } };

  count(); // invoke count

  auto otherCount{ count }; // create a copy of count

  // invoke both count and the copy
  count();
  otherCount();

  return 0;
}
```

输出：

```
1
2
2
```

程序没有打印 1, 2, 3，而是打印了两个2。我们创建 `otherCount` 时拷贝了 `count`，同时也拷贝了 `count` 当前的状态。`count` 的 `i` 是 1，所以`otherCount` 的 `i` 也是 1。因为 `otherCount` 是 `count` 的拷贝，所以它们有各自的 `i`。

再看一个不太明显的例子：

```cpp
#include <iostream>
#include <functional>

void myInvoke(const std::function<void()>& fn)
{
    fn();
}

int main()
{
    int i{ 0 };

    // Increments and prints its local copy of @i.
    auto count{ [i]() mutable {
      std::cout << ++i << '\n';
    } };

    myInvoke(count);
    myInvoke(count);
    myInvoke(count);

    return 0;
}
```

输出：

```
1
1
1
```

这个例子中存在相同的问题，但是更加隐蔽。当通过lambda创建 `std::function`  时，`std::function` 会创建 lambda 的拷贝。因此在调用 `fn()` 时，执行的其实是lambda 的拷贝而不是其本身。

如果我们需要传递一个可变的lambda，并且想要避免无意地复制，有两个方法。一种是使用非捕获lambda来代替——在上面的情况下，我们可以删除捕获并使用静态局部变量来跟踪状态。但是静态局部变量很难跟踪，并且使我们的代码可读性较差。一个更好的选择是从一开始就阻止lambda的复制。但是由于我们不能影响 `std::function` (或其他标准库函数或对象)的实现方式，那要如何才能做到这一点呢?

幸运的是，C++ 提供了一个更加方便的类型(定义在 `<functional>` 头文件中) ——称为 `std::reference_wrapper` 。该类型使我们可以传入一个普通类型，但当做引用使用。更好地是，`std::reference_wrapper` 可以通过`std::ref()` 函数创建。如果我们将 lambda 包装到 `std::reference_wrapper` 中，则每当有人想拷贝 lambda 时，它们会拷贝一个引用而不是对象本身。

使用 `std::ref` 更新代码：

```cpp
#include <iostream>
#include <functional>

void myInvoke(const std::function<void()>& fn)
{
    fn();
}

int main()
{
    int i{ 0 };

    // Increments and prints its local copy of @i.
    auto count{ [i]() mutable {
      std::cout << ++i << '\n';
    } };

    // std::ref(count) 使得 count 被当做引用对待
    // 因此, 任何对其的拷贝都实际拷贝的是引用，确保始终只存在一个 count
    myInvoke(std::ref(count));
    myInvoke(std::ref(count));
    myInvoke(std::ref(count));

    return 0;
}
```

输出符合预期：

```
1
2
3
```

注意，`invoke`  按值获取 `fn` 结果也是一样的。如果我们通过 `std::ref`创建它，则 `std::function` 不会创建 lambda 的副本。

> [!note] "法则"
> 标准库函数可能会复制函数对象(提醒:lambda是函数对象)。如果你想提供带有可变捕获变量的lambda，可以使用 `std::ref`通过引用传递它们。

> [!success] "最佳实践"
> 尽量避免可变的lambda。不可变lambda更容易理解，不会出现上述问题，也不会在添加并行执行时出现更危险的问题。