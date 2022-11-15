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

|Function	|Meaning|
|:---:|---:|
|`std::isalnum(int)`	|Returns non-zero if the parameter is a letter or a digit
|`std::isalpha(int)`	|Returns non-zero if the parameter is a letter
|`std::iscntrl(int)`	|Returns non-zero if the parameter is a control character
|`std::isdigit(int)`	|Returns non-zero if the parameter is a digit
|`std::isgraph(int)`	|Returns non-zero if the parameter is printable character that is not whitespace
|`std::isprint(int)`	|Returns non-zero if the parameter is printable character (including whitespace)
|`std::ispunct(int)`	|Returns non-zero if the parameter is neither alphanumeric nor whitespace
|`std::isspace(int)`	|Returns non-zero if the parameter is whitespace
|`std::isxdigit(int)`	|Returns non-zero if the parameter is a hexadecimal digit (0-9, a-f, A-F)


## 字符串验证

让我们做一个简单的字符串验证案例，要求用户输入他们的名字。验证标准是用户只能输入字母字符或空格。如果遇到其他情况，则将拒绝输入。


When it comes to variable length inputs, the best way to validate strings (besides using a regular expression library) is to step through each character of the string and ensure it meets the validation criteria. That’s exactly what we’ll do here, or better, that’s what `std::all_of` does for us.

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
    std::getline(std::cin, name); // get the entire line, including spaces
  } while (!isValidName(name));

  std::cout << "Hello " << name << "!\n";
}
```

COPY

Note that this code isn’t perfect: the user could say their name was “asf w jweo s di we ao” or some other bit of gibberish, or even worse, just a bunch of spaces. We could address this somewhat by refining our validation criteria to only accept strings that contain at least one character and at most one space.

!!! info "作者注"

	Reader “Waldo” provides a C++20 solution (using std::ranges) that addresses these shortcomings [here](https://www.learncpp.com/cpp-tutorial/stream-states-and-input-validation/#comment-571052)

Now let’s take a look at another example where we are going to ask the user to enter their phone number. Unlike a user’s name, which is variable-length and where the validation criteria are the same for every character, a phone number is a fixed length but the validation criteria differ depending on the position of the character. Consequently, we are going to take a different approach to validating our phone number input. In this case, we’re going to write a function that will check the user’s input against a predetermined template to see whether it matches. The template will work as follows:

A # will match any digit in the user input.  
A @ will match any alphabetic character in the user input.  
A _ will match any whitespace.  
A ? will match anything.  
Otherwise, the characters in the user input and the template must match exactly.

So, if we ask the function to match the template “(###) ###-####”, that means we expect the user to enter a ‘(‘ character, three numbers, a ‘)’ character, a space, three numbers, a dash, and four more numbers. If any of these things doesn’t match, the input will be rejected.

Here is the code:

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
            // The pattern's current element was found in the validators. Call the
            // corresponding function.
            return (*found->second)(ch);
        }
        else
        {
            // The pattern's current element was not found in the validators. The
            // characters have to be an exact match.
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

COPY

Using this function, we can force the user to match our specific format exactly. However, this function is still subject to several constraints: if `#`,` @`, `_`, and `?` are valid characters in the user input, this function won’t work, because those symbols have been given special meanings. Also, unlike with regular expressions, there is no template symbol that means “a variable number of characters can be entered”. Thus, such a template could not be used to ensure the user enters two words separated by a whitespace, because it can not handle the fact that the words are of variable lengths. For such problems, the non-template approach is generally more appropriate.

## 数值验证

When dealing with numeric input, the obvious way to proceed is to use the extraction operator to extract input to a numeric type. By checking the `failbit`, we can then tell whether the user entered a number or not.

Let’s try this approach:

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

        if (age <= 0) // make sure age is positive
            continue;

        break;
    }

    std::cout << "You entered: " << age << '\n';
}
```

COPY

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
