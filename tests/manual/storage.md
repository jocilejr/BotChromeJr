# Teste manual: recuperação segura do `chrome.storage`

## Objetivo
Confirmar que o helper de leitura do `chrome.storage.local` resolve com `null` ou com o valor padrão informado quando a chave não existe e que a função `f()` lida com a ausência de notificações sem lançar erros.

## Preparação
1. Abra o Google Chrome e acesse `chrome://extensions`.
2. Ative o **Modo do desenvolvedor** e clique em **Carregar sem compactação** para carregar esta extensão.
3. Em `chrome://extensions`, localize a extensão carregada e clique em **Service Worker** → **Inspecionar** para abrir o console de fundo.

## Passos
1. No console aberto, execute `await chrome.storage.local.remove("notifications");` para garantir que a chave não exista.
2. Execute `await h("notifications");` e confirme que o resultado é `null`.
3. Execute `await h("notifications", []);` e confirme que o resultado é um array vazio (`[]`).
4. (Opcional) Execute `await h("notifications", ["valor padrão"]);` e confirme que o resultado é o array informado.
5. Ainda com a chave ausente, execute `await f();` e verifique se nenhum erro é exibido no console.

## Resultado esperado
- A chamada `h("notifications")` resolve com `null` quando a chave não existe.
- A chamada com valor padrão resolve exatamente com o valor informado.
- A execução de `f()` não gera exceções, demonstrando que a função trata listas inexistentes de notificações com segurança.
