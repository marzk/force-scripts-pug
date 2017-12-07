/// <reference path="force-scripts.d.ts" />
import { Context } from 'koa';
import path = require('path');
import pug = require('pug');
import Koa = require('koa');
import { getStaticFromEntry } from 'force-scripts';

export interface ViewOpts {
  viewPath: string;
  isDebug: boolean;
  locals?: Locals;
}

export interface Locals {
  // tslint:disable-next-line
  [prop: string]: any;
}

// 初始化时要支持全局变量
// 区分生产环境与开发环境，cache
//
// 使用时只需要this.render name，name对应views文件夹中的相对路径
export default koaViews;

function koaViews(options: ViewOpts): Koa.Middleware {
  const {
    viewPath,
    isDebug = false,
    locals: globalLocals = {},
    ...opts,
  } = options;

  if (typeof viewPath !== 'string') {
    throw new Error('请传入正确的模板路径viewPath');
  }

  return async function(ctx: Context, next) {
    ctx.render = render;
    ctx.renderView = renderView;

    await next();
  } as Koa.Middleware;

  function renderView(name: string, entry: string, locals = {}) {
    const files = getStaticFromEntry(entry);
    return render(name, {
      ...files,
      ...locals,
    });
  }

  function render(name: string, locals = {}): string {
    const filePath = path.resolve(
      viewPath,
      path.extname(name) ? name : `${name}.pug`
    );
    const fn = pug.compileFile(filePath, {
      basedir: viewPath,
      cache: !isDebug,
      compileDebug: isDebug,
      ...opts,
    });

    return fn({
      ...globalLocals,
      ...locals,
    });
  }
}
