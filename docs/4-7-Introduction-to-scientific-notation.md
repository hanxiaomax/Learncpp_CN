---
title: 4.7 - 科学计数法
alias: 4.7 - 科学计数法
origin: /introduction-to-scientific-notation/
origin_title: "4.7 — Introduction to scientific notation"
time: 2021-9-5
type: translation
tags:
- scientific notation
---

在谈论下一个话题之前，我们先来讨论一下科学计数法。

**科学计数法**是一种将大数表示为精简格式的非常有用的方法。尽管科学计数法第一眼看上去会有些陌生，理解科学计数法可以帮助我们理解浮点数的工作原理及其限制。

科学计数法的表示形式为：$有效数字 * 10^{指数}$。例如 `1.2 x 10⁴`中，`1.2` 是有效数字而4是指数。因为10的四次方等于10,000，所以 `1.2 x 10⁴`等于12,000。

按照惯例，科学计数法的有效数字部分，小数点前写一个非零数字，其他非零数字则写到小数点后。

例如，以十进制表示法表示地球的质量时，我们会写成`5973600000000000000000000 kg`。好长一串数字！（而且大到不能被8字节整型所表示）。同时，读起来也很困难（到底是19个0还是20个0？）。即便以逗号来分割成 5,973,600,000,000,000,000,000,000，看上去仍然非常吃力。

如果用科学计数法表示，则可以写作 `5.9736 x 10²⁴ kg`，看上去就非常简洁了。除此之外，科学计数法还有利于对两个非常大或非常小的值比较其数量级，因为只需要比较指数部分即可。

因为在C++中，输入和x指数记号会比较困难 it can be hard to type or display exponents in C++, we use the letter ‘e’ (or sometimes ‘E’) to represent the “times 10 to the power of” part of the equation. For example, `1.2 x 10⁴` would be written as `1.2e4`, and `5.9736 x 10²⁴` would be written as `5.9736e24`.

For numbers smaller than 1, the exponent can be negative. The number `5e-2` is equivalent to `5 * 10⁻²`, which is `5 / 10²`, or `0.05`. The mass of an electron is `9.1093822e-31 kg`.

## How to convert numbers to scientific notation

Use the following procedure:

-   Your exponent starts at zero.
-   Slide the decimal so there is only one non-zero digit to the left of the decimal.
    -   Each place you slide the decimal to the left increases the exponent by 1.
    -   Each place you slide the decimal to the right decreases the exponent by 1.
-   Trim off any leading zeros (on the left end of the significand)
-   Trim off any trailing zeros (on the right end of the significand) only if the original number had no decimal point. We’re assuming they’re not significant unless otherwise specified.

Here’s some examples:

```
Start with: 42030
Slide decimal left 4 spaces: 4.2030e4
No leading zeros to trim: 4.2030e4
Trim trailing zeros: 4.203e4 (4 significant digits)
```

```
Start with: 0.0078900
Slide decimal right 3 spaces: 0007.8900e-3
Trim leading zeros: 7.8900e-3
Don't trim trailing zeros: 7.8900e-3 (5 significant digits)
```

```
Start with: 600.410
Slide decimal left 2 spaces: 6.00410e2
No leading zeros to trim: 6.00410e2
Don't trim trailing zeros: 6.00410e2 (6 significant digits)
```

Here’s the most important thing to understand: The digits in the significand (the part before the ‘e’) are called the **significant digits**. The number of significant digits defines a number’s **precision**. The more digits in the significand, the more precise a number is.

## Precision and trailing zeros after the decimal

Consider the case where we ask two lab assistants each to weigh the same apple. One returns and says the apple weighs 87 grams. The other returns and says the apple weighs 87.00 grams. Let’s assume the weighing is correct. In the former case, the actual weight of the apple could be anywhere between 86.50 and 87.49 grams. Maybe the scale was only precise to the nearest gram. Or maybe our assistant rounded a bit. In the latter case, we are confident about the actual weight of the apple to a much higher degree (it weighs between 86.9950 and 87.0049 grams, which has much less variability).

So in standard scientific notation, we prefer to keep trailing zeros after a decimal point, because those digits impart useful information about the precision of the number.

However, in C++, 87 and 87.000 are treated exactly the same, and the compiler will store the same value for each. There’s no technical reason why we should prefer one over the other (though there might be scientific reasons, if you’re using the source code as documentation).

Now that we’ve covered scientific notation, we’re ready to cover floating point numbers.