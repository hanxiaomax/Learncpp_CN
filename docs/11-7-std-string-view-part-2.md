---
title: 11.7 - std::string_view（第二部分）
alias: 11.7 - std::string_view（第二部分）
origin: /stdstring_view-part-2/
origin_title: "11.7 - std::string_view"
time: 2022-1-2
type: translation
tags:
- std::string_view
- C++17
---

??? note "关键点速记"
	- 


!!! info "作者注"

	本课程的部分内容被移动到了[[4-18-Introduction-to-std-string_view|4.18 - std::string_view 简介]] 。因此，这节课中有部分尚未清理的重复部分。

在上一节课中，我们介绍了C语言风格的字符串，但是使用它们的风险很高。尽管C语言风格字符串的性能很好，但是它们并不易用，安全性也不如 `std::string`。

但是 `std::string` (在 [[4-17-An introduction-to-std-string|4.17 - std::string 简介]] 中介绍)也有它的缺点，尤其是当我们需要常量字符串的时候。

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

`main`函数会将字符串`"hello"` 复制3次，总共得到 4个副本。首先是字符串字面量`“hello”`，它在编译时已知，并存储在二进制文件中。当我们创建 `char[]` 时，会创建一个副本。接下来的两个 `std::string` 对象分别创建一个字符串副本。因为 `std::string` 被设计为可修改的，每个`std::string` 必须包含它自己的字符串副本，这样给定的 `std::string` 可以被修改而不影响任何其他的 `std::string` 对象。


即使 const `std::string` 也存在这个问题，即使它们不能修改。

## `std::string_view`

想象这样一个场景，你坐在家中，从窗户望向街道的时候你看到一辆汽车，你可以看到它，但你却无法触摸或者移动它。你的窗户只是为你提供了一个可以观察汽车的视图，而车则是完全独立的对象。

C++17 引入了使用字符串的另外一种方式——`std::string_view`，它通过`<string_view>` 头文件提供。

和`std::string`不同的是，它不会保存一份字符串的副本，`std::string_view` 只是提供了一个被定义在**其他地方**的字符串的视图。

我们可以使用 `std::string_view` 重新编写上面的代码：

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

COPY

The output is the same, but no more copies of the string “hello” are created. The string “hello” is stored in the binary and is not allocated at run-time. `text` is only a view onto the string “hello”, so no copy has to be created. When we copy a `std::string_view`, the new `std::string_view` observes the same string as the copied-from `std::string_view` is observing. This means that neither `str` nor `more` create any copies. They are views onto the existing string “hello”.

`std::string_view` is not only fast, but has many of the functions that we know from `std::string`.

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

COPY

Because `std::string_view` doesn’t create a copy of the string, if we change the viewed string, the changes are reflected in the `std::string_view`.

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

COPY

We modified `arr`, but `str` appears to be changing as well. That’s because `arr` and `str` share their string. When you use a `std::string_view`, it’s best to avoid modifications to the underlying string for the remainder of the `std::string_view`‘s life to prevent confusion and errors.

Best practice

Use `std::string_view` instead of C-style strings.

Prefer `std::string_view` over `std::string` for read-only strings, unless you already have a `std::string`.

View modification functions

Back to our window analogy, consider a window with curtains. We can close either the left or right curtain to reduce what we can see. We don’t change what’s outside, we just reduce the visible area.

Similarly, `std::string_view` contains functions that let us manipulate the _view_ of the string. This allows us to change the view without modifying the viewed string.

The functions for this are `remove_prefix`, which removes characters from the left side of the view, and `remove_suffix`, which removes characters from the right side of the view.

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

COPY

This program produces the following output:

Peach
each
ea

Unlike real curtains, a `std::string_view` cannot be opened back up. Once you shrink the area, the only way to re-widen it is to reset the view by reassigning the source string to it again.

std::string_view works with non-null-terminated strings

Unlike C-style strings and `std::string`, `std::string_view` doesn’t use null terminators to mark the end of the string. Rather, it knows where the string ends because it keeps track of its length.

```cpp
#include <iostream>
#include <iterator> // For std::size
#include <string_view>

int main()
{
  // No null-terminator.
  char vowels[]{ 'a', 'e', 'i', 'o', 'u' };

  // vowels isn't null-terminated. We need to pass the length manually.
  // Because vowels is an array, we can use std::size to get its length.
  std::string_view str{ vowels, std::size(vowels) };

  std::cout << str << '\n'; // This is safe. std::cout knows how to print std::string_view.

  return 0;
}
```

COPY

This program prints:

aeiou

Converting a `std::string_view` to a C-style string

Some old functions (such as the old strlen function) still expect C-style strings. To convert a `std::string_view` to a C-style string, we can do so by first converting to a `std::string`:

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

COPY

This prints:

ball has 4 letter(s)

However, creating a `std::string` every time we want to pass a `std::string_view` as a C-style string is expensive, so this should be avoided if possible.

Passing strings by const std::string& or std::string_view?

One question that often comes up: is it better to pass strings by `const std::string&` or `std::string_view`?

If we want to write a function that takes a string parameter, making the parameter a `std::string_view` is the most flexible choice, because it can work efficiently with C-style string arguments (including string literals), `std::string` arguments (which will implicitly convert to `std::string_view`), and `std::string_view` arguments:

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

COPY

Note that we pass `std::string_view` by value instead of by const reference. This is because `std::string_view` is typically fast to copy, and pass by value is optimal for cheap to copy types.

There is one case where making the parameter a `const std::string&` is generally better: if your function needs to call some other function that takes a C-style string or `std::string` parameter, then `const std::string&` may be a better choice, as `std::string_view` is not guaranteed to be null-terminated (something that C-style string functions expect) and does not efficiently convert back to a std::string.

Best practice

Prefer passing strings using `std::string_view` (by value) instead of `const std::string&`, unless your function calls other functions that require C-style strings or std::string parameters.

Author’s note

Many examples in future lessons were written prior to the introduction of `std::string_view`, and still use `const std::string&` for function parameters when `std::string_view` should be preferred. We’re working on cleaning these up.

Ownership issues

A `std::string_view`‘s lifetime is independent of that of the string it is viewing (meaning the string being viewed can be destroyed before the `std::string_view` object). If this happens, then accessing the `std::string_view` will cause undefined behavior.

The string that a `std::string_view` is viewing has to have been created somewhere else. It might be a string literal that lives as long as the program does, or a `std::string`, in which case the string lives until the `std::string` decides to destroy it or the `std::string` dies.

`std::string_view` can’t create any strings on its own, because it’s just a view.

Here’s an example of a program that has an ownership issue:

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
} // name dies, and so does the string that name created.

int main()
{
  std::string_view view{ askForName() };

  // view is observing a string that already died.
  std::cout << "Your name is " << view << '\n'; // Undefined behavior

  return 0;
}
```

COPY

What's your name?
nascardriver
Hello nascardriver
Your name is �P@�P@

In function `askForName()`, we create `name` and fill it with data from `std::cin`. Then we create `view`, which can view that string. At the end of the function, we return `view`, but the string it is viewing (`name`) is destroyed, so `view` is now pointing to deallocated memory. The function returns a dangling `std::string_view`.

Accessing the returned `std::string_view` in `main` causes undefined behavior, which on the author’s machine produced weird characters.

The same can happen when we create a `std::string_view` from a `std::string` and then modify the `std::string`. Modifying a `std::string`can cause its internal string to die and be replaced with a new one in a different place. The `std::string_view` will still look at where the old string was, but it’s not there anymore.

Warning

Make sure that the underlying string viewed with a `std::string_view` does not go out of scope and isn’t modified while using the std::string_view.

Opening the window (kinda) via the data() function

The string being viewed by a `std::string_view` can be accessed by using the `data()` function, which returns a C-style string. This provides fast access to the string being viewed (as a C-string). But it should also only be used if the `std::string_view`‘s view hasn’t been modified (e.g. by `remove_prefix` or `remove_suffix`) and the string being viewed is null-terminated.

In the following example, `std::strlen` doesn’t know what a `std::string_view` is, so we need to pass it `str.data()`:

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

COPY

balloon
7

When a `std::string_view` has been modified, `data()` doesn’t always do what we’d like it to. The following example demonstrates what happens when we access `data()` after modifying the view:

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

COPY

all has 6 letter(s)
str.data() is alloon
str is all

Clearly this isn’t what we’d intended, and is a consequence of trying to access the data() of a `std::string_view` that has been modified. The length information about the string is lost when we access `data()`. `std::strlen` and `std::cout` keep reading characters from the underlying string until they find the null-terminator, which is at the end of “balloon”.

Warning

Only use `std::string_view::data()` if the `std::string_view`‘s view hasn’t been modified and the string being viewed is null-terminated. Using `std::string_view::data()` of a non-null-terminated string can cause undefined behavior.

Incomplete implementation

Being a relatively recent feature, `std::string_view` isn’t implemented as well as it could be.

```cpp
std::string s{ "hello" };
std::string_view v{ "world" };

// Doesn't work
std::cout << (s + v) << '\n';
std::cout << (v + s) << '\n';

// Potentially unsafe, or not what we want, because we're treating
// the std::string_view as a C-style string.
std::cout << (s + v.data()) << '\n';
std::cout << (v.data() + s) << '\n';

// Ok, but ugly and wasteful because we have to construct a new std::string.
std::cout << (s + std::string{ v }) << '\n';
std::cout << (std::string{ v } + s) << '\n';
std::cout << (s + static_cast<std::string>(v)) << '\n';
std::cout << (static_cast<std::string>(v) + s) << '\n';
```

COPY

There’s no reason why line 5 and 6 shouldn’t work. They will probably be supported in a future C++ version.

[

](https://www.learncpp.com/cpp-tutorial/pointers-and-arrays/)