
### 维护人
<zhangsong><zhangsong@bayread.com>

####
- 目前是主要在做任务中心签到成功的弹窗，后续根据业务场景扩展

### modal.vue
> Modal组件主体

### modal.js
> Modal组件插件

### 如何引入？
> 在项目的index.js中引入并通过 `Vue.use(Modal)` 安装modal插件

### 如何调用？

```js
// index.js
import Modal from '@/components/FinishModal/modal.js'
Vue.use(Modal)
```
#### $finishModal(title, coin, time)
| 参数名 | 值类型 | 是否必须 |
| --- | --- | --- |
| title | String | 必须 |
| coin | Number | 必须 |
| time | Number | 非必须 |

```js
// example:
this.$finishModal('send a modal', 40, 3000) // send a toast
```

#### $clearModal()
```js
// example:
this.$clearModal() // 清除所有toast
```