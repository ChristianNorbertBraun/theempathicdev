---
title: I Hated Kotlin... Until I Didn’t – Why KMP Might Be Worth It for iOS Developers
author: Christian
date: 2025-02-09
layout: blog
description: Taking a closer look into Kotlin and KMP can feel like bonding with the enemy for an iOS developer. I really wanted to hate it, but my journey took an unexpected turn. This is my story of moving from resistance to understanding, exploring the quirks, challenges, and ultimately rediscovering what it truly means to be a developer.
published: true
---

## I Hate Kotlin

I hate Kotlin for being the language used to develop Android apps. This probably comes from the fact that I'm an iOS developer through and through.
I hate that Kotlin's syntax is so close to Swift's. After switching to Kotlin, I keep writing `func foo()` for the first few minutes. Then, when switching back, I mistakenly write `fun foo()` in Swift.
And why is there a `data class` and a `class` while both are reference types? I hate that there is no counterpart for Swift’s `struct`. Also, when writing Kotlin, you can be sure: there is always a more idiomatic way to write what you just did!

### What About the Return Behavior?

```swift
// Swift
func foo() -> String {
  "foo"
} // returns "foo"

// Kotlin
fun foo(): String {
  "foo"
} // does not compile because it needs a return
```
**Exemple numéro deux**

```swift
let stringArray = ["1", "2"]

// Swift
func foo() -> String {
  stringArray.map {
    return $0
  }
  return "result"
} // returns "result"


// Kotlin
fun foo(): String {
  stringArray.map {
    return it
  }
  return "result"
} // returns "1"

// Correct solution would be to drop the return in this function like this:

fun foo(): String {
  stringArray.map {
    it
  }
  return "result"
} // returns "result"
```

Yes, I know that `map` is an inline function and that this is the reason why it behaves that way. And yes, I know that you can do things with `return` in Kotlin that you can't in Swift. But stuff like this makes it hard. It makes it hard to switch between Swift and Kotlin.

### Kotlin Multiplatform

And I hate that even though Kotlin is mainly used for Android, it invades the iOS space through [Kotlin Multiplatform (KMP)](https://kotlinlang.org/docs/multiplatform.html).
I hate that projects using KMP are often driven by Android developers. In this scenario, it can feel like always being behind, having less impact on the project's direction, or constantly needing to fix issues in the shared Kotlin code to make it work for iOS.

And I probably hate the most that Apple and Swift missed the opportunity to be the language that is shared between iOS and Android.

## I Love Kotlin

I love Kotlin for being so similar to Swift. While learning, I can think about how I would do it in Swift and just search for, e.g., "Swift reduce in Kotlin." I love the small differences that annoy me at first but then reveal the benefits of walking a different path to the same destination. I love Kotlin for its rich library of convenience functions that I never expected to be missing in Swift. I wish Swift had an `.apply{}` function.

### Look at That IDE

It doesn't matter whether it's Android Studio or IntelliJ. With Xcode, I almost forgot how it feels to fully trust my IDE. I love that I can be certain that all usages listed by my IDE are actually all usages of that property. I love that I don't need to be afraid of renames. And guess what – IntelliJ has no issues working with giant projects at all.

### Kotlin Multiplatform Might Not Be So Bad After All

You know what? I actually started to **like** KMP. Compared to Flutter and React Native, it encourages developers to build the UI using the framework and language of their respective native platform. Even though there's [Multiplatform Compose](https://www.jetbrains.com/compose-multiplatform/), the main objective of code sharing doesn't feel like an attempt to eliminate Swift and iOS developers. Instead, KMP is tackling the challenge of developing business logic for both Android and iOS while recognizing the value of native development on both platforms. I love that KMP can bring iOS and Android developers closer together. It requires goodwill from both sides, but when done right, it creates code that either platform feels responsible for while strengthening knowledge of the other platform.

Would I have loved Swift to be the shared language instead of KMP? Hell yes! But is it realistic for Swift, given its origins and smaller community, to take KMP’s place? Maybe, but not yet. There are projects like [skip.tool](https://skip.tools/), but I argue that it will take much longer for a real Swift-based solution to match what KMP is doing.

## Why This Article?

When I first decided to venture into Kotlin, I did so with some despair. Seeing more and more project listings mentioning KMP, and even my current project increasingly adopting KMP, felt like I was being forced to check it out. It felt like KMP was threatening my world of Swift and my identity as an iOS developer. And after eight years of developing for Apple’s platforms, this also kind of threatened a part of my identity. When clients no longer see value in an iOS-only developer, what is my value then?

Taking a closer look at Kotlin and KMP reminded me that iOS development is not who I am but rather what I’m currently using my expertise for. I’m a developer, an engineer, and as such, I can use my platform-independent skills to adapt and pivot. This journey also rekindled my enjoyment of learning. While I generally love learning new things, I suspect that KMP’s proximity to my daily work made me hesitant to give it a try.

KMP is far from perfect, but it might be one solution for all mobile developers alike. Perhaps all it requires from us is to lay down our platform barriers and see ourselves for what we truly are — developers that happen to be working on the mobile platform.

