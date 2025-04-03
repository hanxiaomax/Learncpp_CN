---
title: 22.7 - std-string 插入
alias: 22.7 - std-string 插入
origin: /stdstring-inserting/
origin_title: "22.7 — std::string inserting"
time: 2022-8-26
type: translation
tags:
- string
---



## 插入

向字符串中插入字符可以通过 `insert()` 函数完成。

**`string& string::insert (size_type index, const string& str)`**  
**`string& string::insert (size_type index, const char* str)`**

- 这些函数可以将`str`中的字符，插入到字符串索引`index`位置；
- 这些函数都会返回 `*this` 以便可以被链式调用；
- 如果索引无效，则会抛出 `out_of_range` 异常；
- 如果结果超出最大字符个数则抛出 `length_error` 异常；
- 对于接受C风格字符串版本的函数，`str`不能是NULL。

例子：

```cpp
string sString("aaaa");
cout << sString << endl;

sString.insert(2, string("bbbb"));
cout << sString << endl;

sString.insert(4, "cccc");
cout << sString << endl;
```

输出：

```bash
aaaa
aabbbbaa
aabbccccbbaa
```

还有一个特别吓人的 `insert()`版本，使用它可以将一个子串插入到字符串的`index`位置：

**`string& string::insert (size_type index, const string& str, size_type startindex, size_type num)`**

- 该函数会将`str`中从`startindex`开始的`num`个字符插入到字符串的`index`位置；
- 这些函数都会返回 `*this` 以便可以被链式调用；
- 如果`index`或者`startindex`，越界，则抛出 `out_of_range` 异常；
- 如果结果超出最大字符个数则抛出 `length_error` 异常；

例子：

```cpp
string sString("aaaa");

const string sInsert("01234567");
sString.insert(2, sInsert, 3, 4); // insert substring of sInsert from index [3,7) into sString at index 2
cout << sString << endl;
```

输出：

```bash
aa3456aa
```

还有一个版本的 `insert()` 可以将C语言风格字符串的前面一部分插入到字符串中：

**`string& string::insert(size_type index, const char* str, size_type len)`**

- 将`str`中的前 `len` 个字符插入到字符串中`index`位置；
- 这些函数都会返回 `*this` 以便可以被链式调用；
- 如果索引无效，则抛出 `out_of_range` 异常；
- 如果结果超出最大字符个数则抛出 `length_error` 异常；
- 会忽略特殊字符 (例如 `”`)

例子：

```cpp
string sString("aaaa");

sString.insert(2, "bcdef", 3);
cout << sString << endl;
```

输出：

```bash
aabcdaa
```

还有一个版本的 `insert()` 可以插入某个字符若干次：

**`string& string::insert(size_type index, size_type num, char c)`**

- 将字符`c`在字符串`index`处插入 `num` 次；
- 这些函数都会返回 `*this` 以便可以被链式调用；
- 如果索引无效，则抛出 `out_of_range` 异常；
- 如果结果超出最大字符个数则抛出 `length_error` 异常；

例子：

```cpp
string sString("aaaa");

sString.insert(2, 4, 'c');
cout << sString << endl;
```

输出：

```bash
aaccccaa
```

最后，还有三个版本的 `insert()` 用于配合[[iterator|迭代器]]使用：

**`void insert(iterator it, size_type num, char c)`**  
**`iterator string::insert(iterator it, char c)`**  
**`void string::insert(iterator it, InputIterator begin, InputIterator end)`**

- 第一个函数将字符`c`在迭代器`it`前插入`num`次；
- 第二个函数将字符c插入到迭代器`it`前并返回一个指向该字符的迭代器；
- 第三个函数将 `[begin,end)` 范围内的字符插入到迭代器`it`前；
- 如果结果超出最大字符个数则抛出 `length_error` 异常；