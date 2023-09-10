# 解决sourcetree推送github报443问题
取消全局代理：
```
git config --global --unset http.proxy
 
git config --global --unset https.proxy
```