---
title: 23.5 - stream 状态和输入验证
alias: 23.5 - stream 状态和输入验证
origin: /stream-states-and-input-validation/
origin_title: "23.5 — Stream states and input validation"
time: 2022-9-7
type: translation
tags:
- io
---

??? note "关键点速记"


## 流的状态

`ios_base` 类包含了多个不同的状态标记，它们可以用来表示流的不同状态：

|标记	|含义|
|:---:|---:|
|goodbit	|一切正常
|badbit	|发生了某种严重错误(例如：程序读取超过了文件末尾)
|eofbit	|流到达文件末尾
|failbit	|发生非致命错误(例如，程序期望整型时用户输入了字符)

尽管这些标记定义在 `ios_base`中，但是因为 `ios` 派生自 `ios_base` 而且 `ios` 写起来更简单，所以我们通常会通过 `ios` 访问这些标记(例如： as `std::ios::failbit`).

`ios` 同样也提供了一些成员函数，用于访问这些状态：

|成员函数	|含义|
|:---:|---:|
|`good()`	|如果设置了`goodbit`则返回`true`(流状态正常)
|`bad()`	      |如果设置了`badbit`则返回`true`(发生严重错误)
|`eof()`	|      如果设置了`eofbit`则返回`true`(流到达文件末尾)
|`fail()`	|如果设置了`failbit`则返回`true`(发生非致命错误)
|`clear()`	|清空所有标记并将流状态设置为 `goodbit`
|`clear(state)`	|清空所有标记并将流状态设置为参数`state`表示的状态
|`rdstate()`	|返回当前设置的标记
|`setstate(state)`	|将流状态设置为参数`state`表示的状态

实践中最常遇到的标记是 `failbit`，当用户输入非法数据时则该标记就会被设置。例如：

```cpp
std::cout << "Enter your age: ";
int age {};
std::cin >> age;
```

程序期望用户输入一个整型。但是如果用户输入的是一个非数值数据，例如 “Alex”，`cin` 就无法提取任何年龄信息，此时 `failbit` 会被设置 。

当发生错误时，流会被设置为除`goodbit`以外的状态，后续对流的操作也会被忽略。此时可以通过调用  `clear()` 函数来重置状态。

## 输入验证

**输入验证**是检查用户输入是否满足某些条件的过程。输入验证通常可以分为两种类型：字符串和数字。

对于字符串验证，所有用户输入都会被作为字符串接受，然后根据其格式是否满足要求来判断应该接受或拒绝该字符串。例如，如果我们要求用户输入一个电话号码，我们可能希望确保其输入的数据有10位数字。在大多数语言中(特别是像Perl和PHP这样的脚本语言)，这是通过正则表达式完成的。C++标准库也有一个[正则表达式库](https://en.cppreference.com/w/cpp/regex)。因为正则表达式比手动字符串验证慢，所以只有在性能(编译时和运行时)要求不高或者手动验证太麻烦的情况下才应该使用正则表达式。

对于数值验证，我们通常关心的是用户输入的数字是否在特定的范围内(例如，在0到20之间)。然而，与字符串验证不同的是，用户可以输入完全不是数字的东西——我们也需要处理这些情况。

为此，C++提供了许多有用的函数，我们可以使用它们来确定特定的字符是数字还是字母。以下函数位于`cctype`头文件中

|函数	|含义|
|:---:|---:|
|`std::isalnum(int)`	|如果参数是字母或数字则返回非零值
|`std::isalpha(int)`	|如果参数是字母则返回非零值
|`std::iscntrl(int)`	|如果参数是控制字符则返回非零值
|`std::isdigit(int)`	|如果参数是数字则返回非零值
|`std::isgraph(int)`	|如果参数是非空白可打印字符则返回非零值
|`std::isprint(int)`	|如果参数是可打印字符（包括非空白）则返回非零值
|`std::ispunct(int)`	|如果参数是不是字母、数字或空白符返回非零值 
|`std::isspace(int)`	|如果参数是空白符则返回非零值
|`std::isxdigit(int)`	|如果参数是十六进制则返回非零值

## 字符串验证

让我们做一个简单的字符串验证案例，要求用户输入他们的名字。验证标准是用户只能输入字母字符或空格。如果遇到其他情况，则将拒绝输入。

对于不定长度的输入，验证字符串的最佳方法(除了使用正则表达式库之外)是逐个遍历字符串的每个字符，并确保它满足验证标准。这正是我们在这里要做的，或者通过`std::all_of` 完成。

```cpp
#include <algorithm> // std::all_of
#include <cctype> // std::isalpha, std::isspace
#include <iostream>
#include <ranges>
#include <string>
#include <string_view>

bool isValidName(std::string_view name)
{
  return std::ranges::all_of(name, [](char ch) {
    return (std::isalpha(ch) || std::isspace(ch));
  });

  // Before C++20, without ranges
  // return std::all_of(name.begin(), name.end(), [](char ch) {
  //    return (std::isalpha(ch) || std::isspace(ch));
  // });
}

int main()
{
  std::string name{};

  do
  {
    std::cout << "Enter your name: ";
    std::getline(std::cin, name); // 读取整行输入，包括空格
  } while (!isValidName(name));

  std::cout << "Hello " << name << "!\n";
}
```

注意，这段代码并不完美：用户可以说他们的名字是“asf w jweo s di we ao”或其他一些乱七八糟的东西，甚至更糟，只是一堆空格。我们可以通过改进验证标准来解决这个问题，使其只接受至少包含一个字符和最多一个空格的字符串。

!!! info "作者注"

	读者“Waldo”提供了一个C++20解决方案(使用std::ranges)来解决这些缺点，参考[这里](https://www.learncpp.com/cpp-tutorial/stream-states-and-input-validation/#comment-571052)

再看另一个例子，我们要求用户输入他们的电话号码。虽然用户名的长度是可变的，但每个字符的验证标准都是相同的。而电话号码的长度虽然是固定的，但验证标准则根据字符的位置而不同。因此需要采用不同的方法来验证电话号码输入。在本例中，我们将编写一个函数，根据预先确定的模板检查用户的输入是否匹配。模板的工作方式如下:

- `#` 会匹配任何输入的数字；
- `@` 会匹配任何输入的英文字母；
- `_` 会匹配任何输入的空白；
- `?` 匹配所有。

除此之外，用户输入的其他字符必须精确匹配。

因此，如果模板为 “(###) ###-####”，则表示用户需要输入 ‘`(`‘，三个数字， ‘`)`’ ，空格，三个数字，短横线，四个数字。对于任何不满足上述要求的输入，都会被程序拒绝。

代码如下：

```cpp
#include <algorithm> // std::equal
#include <cctype> // std::isdigit, std::isspace, std::isalpha
#include <iostream>
#include <map>
#include <ranges>
#include <string>
#include <string_view>

bool inputMatches(std::string_view input, std::string_view pattern)
{
    if (input.length() != pattern.length())
    {
        return false;
    }

    // This table defines all special symbols that can match a range of user input
    // Each symbol is mapped to a function that determines whether the input is valid for that symbol
    static const std::map<char, int (*)(int)> validators{
      { '#', &std::isdigit },
      { '_', &std::isspace },
      { '@', &std::isalpha },
      { '?', [](int) { return 1; } }
    };

    // Before C++20, use
    // return std::equal(input.begin(), input.end(), pattern.begin(), [](char ch, char mask) -> bool {
    // ...

    return std::ranges::equal(input, pattern, [](char ch, char mask) -> bool {
        if (auto found{ validators.find(mask) }; found != validators.end())
        {
            // 找到可匹配的模式，调用对应的校验函数
            return (*found->second)(ch);
        }
        else
        {
            // 没有找到匹配的模式，此时要求字符精确匹配
            return (ch == mask);
        }
        });
}

int main()
{
    std::string phoneNumber{};

    do
    {
        std::cout << "Enter a phone number (###) ###-####: ";
        std::getline(std::cin, phoneNumber);
    } while (!inputMatches(phoneNumber, "(###) ###-####"));

    std::cout << "You entered: " << phoneNumber << '\n';
}
```

使用这个函数可以强制用户按照我们要求的格式输入。不过，这个方法仍然有局限性：如果`#`、`@`、 `_` 和 `?` 也是合法的用户输入，则该函数将无法工作，因为这些符号已经被赋予了特殊的含义。此外，不同于正则表达式，该模板中没有符号可以表示“输入一组不定长的字符”。因此，该模板不能被用来确保用户输入两个单词（空格隔开），因为它不能处理变长的输入。对于这种类型的输入，非模板的方法更加合适 。

## 数值验证

==在处理数值型输入时，最常见的做法是使用[[extraction-operator|提取运算符]]将输入提取到一个数值类型的变量中==（参见：[[23-4-stream-classes-for-strings#转换字符串和数字]]）。通过检查流状态标记`failbit`，我们就可以知道用户的输入是否是一个数字。

请看下面代码：

```cpp
#include <iostream>
#include <limits>

int main()
{
    int age{};

    while (true)
    {
        std::cout << "Enter your age: ";
        std::cin >> age;

        if (std::cin.fail()) // 无法提取
        {
            std::cin.clear(); // 重置状态为 goodbit，以便可以调用 ignore()
            std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n'); // 从流中忽略非法输入
            continue; // 继续
        }

        if (age <= 0) // 确保输入的年龄是正数
            continue;

        break;
    }

    std::cout << "You entered: " << age << '\n';
}
```


If the user enters an integer, the extraction will succeed. `std::cin.fail()` will evaluate to false, skipping the conditional, and (assuming the user entered a positive number), we will hit the break statement, exiting the loop.

If the user instead enters input starting with a letter, the extraction will fail. `std::cin.fail()` will evaluate to true, and we will go into the conditional. At the end of the conditional block, we will hit the continue statement, which will jump back to the top of the while loop, and the user will be asked to enter input again.

However, there’s one more case we haven’t tested for, and that’s when the user enters a string that starts with numbers but then contains letters (e.g. “34abcd56”). In this case, the starting numbers (34) will be extracted into age, the remainder of the string (“abcd56”) will be left in the input stream, and the `failbit` will NOT be set. This causes two potential problems:

1.  If you want this to be valid input, you now have garbage in your stream.
2.  If you don’t want this to be valid input, it is not rejected (and you have garbage in your stream).

Let’s fix the first problem. This is easy:

```cpp
#include <iostream>
#include <limits>

int main()
{
    int age{};

    while (true)
    {
        std::cout << "Enter your age: ";
        std::cin >> age;

        if (std::cin.fail()) // no extraction took place
        {
            std::cin.clear(); // reset the state bits back to goodbit so we can use ignore()
            std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n'); // clear out the bad input from the stream
            continue; // try again
        }

        std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n'); // clear out any additional input from the stream

        if (age <= 0) // make sure age is positive
            continue;

      break;
    }

    std::cout << "You entered: " << age << '\n';
}
```


If you don’t want such input to be valid, we’ll have to do a little extra work. Fortunately, the previous solution gets us half way there. We can use the `gcount()` function to determine how many characters were ignored. If our input was valid, `gcount()` should return 1 (the newline character that was discarded). If it returns more than 1, the user entered something that wasn’t extracted properly, and we should ask them for new input. Here’s an example of this:

```cpp
#include <iostream>
#include <limits>

int main()
{
    int age{};

    while (true)
    {
        std::cout << "Enter your age: ";
        std::cin >> age;

        if (std::cin.fail()) // no extraction took place
        {
            std::cin.clear(); // reset the state bits back to goodbit so we can use ignore()
            std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n'); // clear out the bad input from the stream
            continue; // try again
        }

        std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n'); // clear out any additional input from the stream
        if (std::cin.gcount() > 1) // if we cleared out more than one additional character
        {
            continue; // we'll consider this input to be invalid
        }

        if (age <= 0) // make sure age is positive
        {
            continue;
        }

        break;
    }

    std::cout << "You entered: " << age << '\n';
}
```

COPY

## 数值作为字符串进行验证

The above example was quite a bit of work simply to get a simple value! Another way to process numeric input is to read it in as a string, then try to convert it to a numeric type. The following program makes use of that methodology:

```cpp
#include <charconv> // std::from_chars
#include <iostream>
#include <optional>
#include <string>
#include <string_view>

std::optional<int> extractAge(std::string_view age)
{
  int result{};
  auto end{ age.data() + age.length() };

  // Try to parse an int from age
  if (std::from_chars(age.data(), end, result).ptr != end)
  {
    return {};
  }

  if (result <= 0) // make sure age is positive
  {
    return {};
  }

  return result;
}

int main()
{
  int age{};

  while (true)
  {
    std::cout << "Enter your age: ";
    std::string strAge{};
    std::getline(std::cin >> std::ws, strAge);

    if (auto extracted{ extractAge(strAge) })
    {
      age = *extracted;
      break;
    }
  }

  std::cout << "You entered: " << age << '\n';
}
```

COPY

Whether this approach is more or less work than straight numeric extraction depends on your validation parameters and restrictions.

As you can see, doing input validation in C++ is a lot of work. Fortunately, many such tasks (e.g. doing numeric validation as a string) can be easily turned into functions that can be reused in a wide variety of situations.
