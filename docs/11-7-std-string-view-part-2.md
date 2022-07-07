---
title: 11.7 - std::string_view（第二部分）
alias: 11.7 - std::string_view（第二部分）
origin: /stdstring_view-part-2/
origin_title: "11.7 - std:: string_view"
time: 2022-1-2
type: translation
tags:
- std:: string_view
- C++17
---

??? note "关键点速记"
    - `std:: string_view` 提供了一个观察字符串的视图，字符串本身存放在二进制文件中
    - 创建 `std:: string_view` 时不会发生复制，但是修改时会影响到所有的对象。
    - `remove_prefix`和`remove_suffix`分别用于从字符串视图的左侧和右侧删除字符（不会影响到原字符串）
    - 要将`std:: string_view` 转换为C风格的字符串，我们可以先转换为`std:: string`
    - 使用 `str.c_str()`获取C风格字符串
    - 如果我们想写一个接受字符串形参的函数，将形参设置为 `std:: string_view` 是最灵活的选择，因为它可以高效地配合C风格的字符串参数(包括字符串字面量)、`std:: string`参数(将隐式转换为' std:: string_view ')和 `std:: string_view`参数来工作：
    - 优先使用`std:: string_view`([[pass-by-value|按值传递]])而不是`const std:: string&`，除非你需要调用其他要求使用C风格字符串或`std::string`的函数。
    - 确保`std::string_view`观察的字符串不会[[going-out-of-scope|离开作用域]]，也不会被修改。
	    - 因为 `std::string_view` 的生命周期是独立于它“观察”的字符串的（也就是说该字符串对象可以在先于`std::string_view`被销毁)。这种情况下访问`std::string_view`就会造成[[1-6-Uninitialized-variables-and-undefined-behavior|未定义行为]]。
    - 只有在`std::string_view`没有被修改的情况下且字符串以空结束符结尾的情况下使用`std::string_view::data()` 如果字符串没有以空结束符结尾，则`std::string_view::data()`会导致未定义行为。

!!! info "作者注"

    本课程的部分内容被移动到了[[4-18-Introduction-to-std-string_view|4.18 - std:: string_view 简介]] 。因此，这节课中有部分尚未清理的重复部分。

在上一节课中，我们介绍了 C 语言风格的字符串，但是使用它们的风险很高。尽管 C 语言风格字符串的性能很好，但是它们并不易用，安全性也不如 `std:: string`。

但是 `std:: string` (在 [[4-17-An introduction-to-std-string|4.17 - std:: string 简介]] 中介绍)也有它的缺点，尤其是当我们需要常量字符串的时候。

考虑下面的例子：

```cpp
#include <iostream>
#include <string>

int main()
{
  char text[]{ "hello" };
  std::string str{ text };
  std::string more{ str };

  std::cout << text << ' ' << str << ' ' << more << '\n';

  return 0;
}
```

和期望的一样，打印结果如下：

```
hello hello hello
```

`main` 函数会将字符串 `"hello"` 复制 3 次，总共得到 4 个副本。首先是字符串字面量 `“hello”`，它在编译时已知，并存储在二进制文件中。当我们创建 `char[]` 时，会创建一个副本。接下来的两个 `std:: string` 对象分别创建一个字符串副本。因为 `std:: string` 被设计为可修改的，每个 `std:: string` 必须包含它自己的字符串副本，这样给定的 `std:: string` 可以被修改而不影响任何其他的 `std:: string` 对象。

即使 const `std:: string` 也存在这个问题，即使它们不能修改。

## `std:: string_view`

想象这样一个场景，你坐在家中，从窗户望向街道的时候你看到一辆汽车，你可以看到它，但你却无法触摸或者移动它。你的窗户只是为你提供了一个可以观察汽车的视图，而车则是完全独立的对象。

C++17 引入了使用字符串的另外一种方式——`std:: string_view`，它通过 `<string_view>` 头文件提供。

和 `std:: string` 不同的是，它不会保存一份字符串的副本，`std:: string_view` 只是提供了一个被定义在**其他地方**的字符串的视图。

我们可以使用 `std:: string_view` 重新编写上面的代码：

```cpp
#include <iostream>
#include <string_view>

int main()
{
  std::string_view text{ "hello" }; // view the text "hello", which is stored in the binary
  std::string_view str{ text }; // view of the same "hello"
  std::string_view more{ str }; // view of the same "hello"

  std::cout << text << ' ' << str << ' ' << more << '\n';

  return 0;
}
```

输出结果是相同的，但这次不再需要创建字符串 `“hello”` 的副本。字符串 `"hello"` 存储在二进制文件中，不会在运行时分配。`text` 只是字符串 `"hello"` 上的一个视图，所以不需要创建副本。当我们复制 `std:: string_view` 时，新的 `std:: string_view` 观察到的字符串与被复制的 `std:: string_view` 是相同。这意味着 `str` 和 `more` 都不会创建任何副本。它们是现有字符串 `"hello"` 的视图。

`std:: string_view` 不仅仅快，而且还具有 `std:: string` 的大部分功能。

```cpp
#include <iostream>
#include <string_view>

int main()
{
  std::string_view str{ "Trains are fast!" };

  std::cout << str.length() << '\n'; // 16
  std::cout << str.substr(0, str.find(' ')) << '\n'; // Trains
  std::cout << (str == "Trains are fast!") << '\n'; // 1

  // Since C++20
  std::cout << str.starts_with("Boats") << '\n'; // 0
  std::cout << str.ends_with("fast!") << '\n'; // 1

  std::cout << str << '\n'; // Trains are fast!

  return 0;
}
```

由于 `std:: string_view` 并不会创建一个字符串的副本，当我们修改 `std:: string_view` 的时候，被观察的字符串也会被修改。

```cpp
#include <iostream>
#include <string_view>

int main()
{
  char arr[]{ "Gold" };
  std::string_view str{ arr };

  std::cout << str << '\n'; // Gold

  // Change 'd' to 'f' in arr
  arr[3] = 'f';

  std::cout << str << '\n'; // Golf

  return 0;
}
```

我们修改了 `arr`，但是 `str` 也被修改了。这是因为它们实际上共享的是同一个字符串。如果你需要使用 `std:: string_view`，那么最好不要去修改它对应的字符串，避免造成困扰和错误。

!!! success "最佳实践"

    使用 `std:: string_view` 代替 C 语言风格字符串。

对于**只读**字符串，优先使用 `std:: string_view` 而不是 `std:: string`。除非你已经具有了一个 `std:: string`。

## 视图修改函数

回到之前有关”窗户“的比喻，考虑一个有”窗帘“的窗户。通过拉上左侧或右侧的窗帘，我们可以限制能够从窗户看到的范围，但是这并不会实际改变窗户外的物体，我们只是减小了视角而已。

类似地，`std:: string_view` 也提供了一些函数用于操作观察字符串的视图。通过这些函数我们可以修改看到的字符串，但不会修改被观察的字符串本身。

`remove_prefix` 用于从视图的左侧删除字符，而 `remove_suffix` 则用于从视图的右侧删除字符。

```cpp
#include <iostream>
#include <string_view>

int main()
{
  std::string_view str{ "Peach" };

  std::cout << str << '\n';

  // Ignore the first character.
  str.remove_prefix(1);

  std::cout << str << '\n';

  // Ignore the last 2 characters.
  str.remove_suffix(2);

  std::cout << str << '\n';

  return 0;
}
```

打印结果为：

```
Peach
each
ea
```

与真正的窗帘不同， `std:: string_view` 不能被重新打开。一旦你缩小了区域，重新扩大它的唯一方法就是通过重新分配源字符串给它来重置视图。

## `std::string_view` 可以配合没有空字符结束符的字符串

C风格的字符串和 `std:: string` 不同，`std:: string_view` 不使用空结束符来标记字符串的结束。相反，它知道字符串在哪里结束，因为它会跟踪字符串的长度。

```cpp
#include <iostream>
#include <iterator> // For std::size
#include <string_view>

int main()
{
  // No null-terminator.
  char vowels[]{ 'a', 'e', 'i', 'o', 'u' };

  // vowels 并没有包含结束符，我们需要传递长度
  // 因为 vowels 是数组，我们可以使用 std::size 来获取长度
  std::string_view str{ vowels, std::size(vowels) };

  std::cout << str << '\n'; // 这是安全的。std::cout 知道如何打印 std::string_view.

  return 0;
}
```

打印结果如下：

```
aeiou
```

## 将 `std::string_view` 转换为 C 风格字符串

一些旧的函数(比如旧的 `strlen` 函数)仍然期望使用C风格的字符串。要将`std:: string_view` 转换为C风格的字符串，我们可以先转换为`std:: string`：

```cpp
#include <cstring>
#include <iostream>
#include <string>
#include <string_view>

int main()
{
  std::string_view sv{ "balloon" };

  sv.remove_suffix(3);

  // Create a std::string from the std::string_view
  std::string str{ sv };

  // Get the null-terminated C-style string.
  auto szNullTerminated{ str.c_str() };

  // Pass the null-terminated string to the function that we want to use.
  std::cout << str << " has " << std::strlen(szNullTerminated) << " letter(s)\n";

  return 0;
}
```

打印结果：

```
ball has 4 letter(s)
```

不过，每次`std:: string_view`需要被作为C风格字符串传递时，都需要创建一个`std::string`，这么做的开销是非常大的，因此应该尽量避免这么做。

## 通过 `const std::string&` 还是 `std::string_view` 来传递字符串？

一个经常遇到的问题是：应该通过 `const std::string&` 还是 `std::string_view` 传递字符串？那种方式最好？

如果我们想写一个接受字符串形参的函数，将形参设置为 `std::string_view` 是最灵活的选择，因为它可以高效地配合C风格的字符串参数(包括字符串字面量)、`std::string`参数(将隐式转换为`std::string_view` ')和 `std::string_view`参数来工作：

```cpp
#include <iostream>
#include <string>
#include <string_view>

void printSV(std::string_view sv)
{
    std::cout << sv << '\n';
}

int main()
{
    std::string s{ "Hello, world" };
    std::string_view sv { s };

    printSV(s);              // ok: pass std::string
    printSV(sv);             // ok: pass std::string_view
    printSV("Hello, world"); // ok: pass C-style string literal

    return 0;
}
```

注意，我们通过值传递`std::string_view`，而不是通过 `const` 引用类型来传递。这是因为`std::string_view` 的复制速度通常较快，而[[pass-by-value|按值传递]]对于复制开销较小的类型来说是最优的。

有一种情况，将形参设置为 `const std::string&` 通常更好：如果你的函数需要调用其他接受C风格字符串或`std::string` 形参的函数，那么 `const std::string&` 可能是更好的选择，因为 `std::string_view` 不能保证以空字符结束(而这是C风格字符串函数所期望的)，并且不能有效地转换回`std::string`。


!!! success "最佳实践"

    优先使用`std:: string_view`([[pass-by-value|按值传递]])而不是`const std:: string&`，除非你需要调用其他要求使用C风格字符串或`std::string`的函数。
    

!!! info "作者注"

    后面的一些课程是在引入`std::string_view`之前编写的，所以仍然使用的是`const std::string&`（实际上用`std::string_view`更好），我们正在着手清理相关的代码。


## 所有权问题

`std::string_view` 的生命周期是独立于它“观察”的字符串的（也就是说该字符串对象可以在先于`std::string_view`被销毁)。这种情况下访问`std::string_view`就会造成[[1-6-Uninitialized-variables-and-undefined-behavior|未定义行为]]。

`std::string_view` 表示的字符串必须是在其他地方已经被创建的字符串。它可能是一个随着程序启动停止而创建销毁的[[literals|字面量]]，也可能是一个 `std::string`，这种情况下当`str::string`销毁时该字符串也就不存在了。

`std:: string_view` 自身不能创建任何的字符串，它只是观察某个字符串的视图。

下面这个程序就出现了所有权问题：

```cpp
#include <iostream>
#include <string>
#include <string_view>

std::string_view askForName()
{
  std::cout << "What's your name?\n";

  // Use a std::string, because std::cin needs to modify it.
  std::string name{};
  std::cin >> name;

  // We're switching to std::string_view for demonstrative purposes only.
  // If you already have a std::string, there's no reason to switch to
  // a std::string_view.
  std::string_view view{ name };

  std::cout << "Hello " << view << '\n';

  return view;
} // name 变量被销毁，对应的字符串也销毁了

int main()
{
  std::string_view view{ askForName() };

  // view 正在为一个不存在的字符串提供视图
  std::cout << "Your name is " << view << '\n'; // 未定义行为
  return 0;
}
```


```
What's your name?
nascardriver
Hello nascardriver
Your name is �P@�P@
```

在`askForName()`函数中，我们创建了一个变量 `name` 并且通过 `std::cin` 对其进行了赋值。然后，我们创建了变量 `view`，通过这个变量我们可“观察”上述字符串。在函数结束时，我们返回 `view`，但是该变量实际观察的字符串 (`name`) 已经被销毁了，因此 `view` 现在指向的是一块已经被释放的内存。函数返回的是一个[[dangling|悬垂(dangling) ]]`std::string_view`.

在`mian`函数中访问被返回的`std::string_view` 会导致未定义行为，在笔者的电脑上，会打印奇怪的字符。

问题发生的原因在于你通过`std::string` 创建了一个 `std::string_view`，然后又修改了 `std::string`。修改 `std::string` 会导致内部字符串被销毁或被替换（在代码的其他部分）。`std::string_view` 总是指向该字符串， 但该字符串可能已经不是它原来的模样或者已经不存在了。

!!! warning "注意"

    确保`std::string_view`观察的字符串不会[[离开作用域(going out of scope)]]，也不会被修改。
    
## 使用`data()`函数来打开”窗户“

`std::string_view` 观察的字符串，可以通过`data()` 函数来访问，它返回的结果是一个C风格的字符串。这种方式提供了一种快速访问被观察字符串的方法。但是它只能在`std::string_view` 视图没有被修改的时候使用(例如通过 `remove_prefix` 或 `remove_suffix`修改视图)，，该字符串是有空结束符的。

在下面的例子中，`std::strlen` 函数不能识别 `std:: string_view` ，因此我们必须传入 `str.data()`：

```cpp
#include <cstring> // For std::strlen
#include <iostream>
#include <string_view>

int main()
{
  std::string_view str{ "balloon" };

  std::cout << str << '\n';

  // We use std::strlen because it's simple, this could be any other function
  // that needs a null-terminated string.
  // It's okay to use data() because we haven't modified the view, and the
  // string is null-terminated.
  std::cout << std::strlen(str.data()) << '\n';

  return 0;
}
```

```
balloon
7
```

当 `std:: string_view` 被修改后，`data()` 就不能完成我们期望的任务了。下面的例子展示了当视图被修改后`data()` 的行为：

```cpp
#include <cstring>
#include <iostream>
#include <string_view>

int main()
{
  std::string_view str{ "balloon" };

  // Remove the "b"
  str.remove_prefix(1);
  // remove the "oon"
  str.remove_suffix(3);
  // Remember that the above doesn't modify the string, it only changes
  // the region that str is observing.

  std::cout << str << " has " << std::strlen(str.data()) << " letter(s)\n";
  std::cout << "str.data() is " << str.data() << '\n';
  std::cout << "str is " << str << '\n';

  return 0;
}
```


```
all has 6 letter(s)
str.data() is alloon
str is all
```

这显然不是我们期望的，这是因为我们使用 `data()`来访问一个已经被修改的 `std::string_view`。字符串的长度信息在我们使用`data()`时就丢失了，`std:: strlen` 和 `std:: cout` 会持续读取直到遇到第一个空结束符，也就是“balloon”的末尾。

!!! warning "注意"

    只有在`std::string_view`没有被修改的情况下且字符串以空结束符结尾的情况下使用`std:: string_view:: data()` 如果字符串没有以空结束符结尾，则`std:: string_view:: data()`会导致未定义行为。

## 不完整的实现

作为一个相对较新的特性来说，`std::string_view` 的实现完成度并不如预期。

```cpp hl_lines="5,6"
std::string s{ "hello" };
std::string_view v{ "world" };

// 不能工作
std::cout << (s + v) << '\n';
std::cout << (v + s) << '\n';

// 可能不安全，也可能并不是我们希望的做法，因为我们此时将std::string_view当做
// C风格字符串来使用
std::cout << (s + v.data()) << '\n';
std::cout << (v.data() + s) << '\n';

// 可以, 可以但是不优雅，而且浪费资源，因为我们需要构建一个新的 std::string.
std::cout << (s + std::string{ v }) << '\n';
std::cout << (std::string{ v } + s) << '\n';
std::cout << (s + static_cast<std::string>(v)) << '\n';
std::cout << (static_cast<std::string>(v) + s) << '\n';
```

没道理不能使用第五行和第六行的方式，这个特性可能会在未来的C++版本中被支持。
