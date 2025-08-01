/*
 * File: env.d.ts                                                              *
 * Project: astro-blog                                                         *
 * Created Date: 2025-08-01 16:35:24                                           *
 * Author: aiyoudiao                                                           *
 * -----                                                                       *
 * Last Modified:  2025-08-01 16:35:24                                         *
 * Modified By: aiyoudiao                                                      *
 * -----                                                                       *
 * Copyright (c) 2025 哎哟迪奥(码二)                                                 *
 * --------------------------------------------------------------------------- *
 */
interface ImportMetaEnv {
  readonly DB_PASSWORD: string;
  readonly PUBLIC_POKEAPI: string;
  // 更多环境变量…
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// 自定义类型声明
declare var myString: string;
declare function myFunction(): boolean;

interface Window {
  myFunction(): boolean;
}

// Astro 类型，如果你已经有 `tsconfig.json`，则不需要
/// <reference path="../.astro/types.d.ts" />
