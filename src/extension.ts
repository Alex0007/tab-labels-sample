import * as vscode from 'vscode';

const calculateTabLabels = (tab: vscode.Tab): vscode.window.TabLabelInput | undefined => {
  const { fsPath }: { fsPath: string | undefined } = (tab?.input as vscode.TabInputText).uri as any ?? {};

  if (!fsPath) return;

  const parts = fsPath.split('/');

  const [folder, file] = [parts[parts.length - 2], parts[parts.length - 1]];

  return {
    name: [folder, file].join('/'),
    description: fsPath
  };
};

export function activate(context: vscode.ExtensionContext) {
  console.log('extension activated');

  const renameAllTabs = () => {
    const tabGroup = vscode.window.tabGroups.activeTabGroup;
    tabGroup.tabs.forEach((tab, index) => {
      vscode.window.tabGroups.renameTab(tab, calculateTabLabels(tab));
    });
  };

  const d1 = vscode.commands.registerCommand('extension.renameTab', async () => {
    const tab = vscode.window.tabGroups.activeTabGroup.activeTab!;

    const name = await vscode.window.showInputBox({ prompt: "name?" });
    const description = name
      ? await vscode.window.showInputBox({ prompt: "description?" }) ?? ''
      : '';

    vscode.window.tabGroups.renameTab(
      tab!,
      name
        ? { name, description }
        : undefined
    );
  });

  const d2 = vscode.commands.registerCommand('extension.renameAllTabs', async () => {
    renameAllTabs();
  });

  const d3 = vscode.commands.registerCommand('extension.watchTabs', async () => {
    renameAllTabs();

      vscode.window.tabGroups.onDidChangeTabs(ev => {
        const tab = ev.opened[0];
  
      if (!tab) return;
  
      vscode.window.tabGroups.renameTab(tab, calculateTabLabels(tab));
    });
    
  });

  const d4 = vscode.commands.registerCommand('extension.revertTabNames', async () => {
    return vscode.window.tabGroups.activeTabGroup.tabs.forEach(tab => {
      vscode.window.tabGroups.renameTab(tab, undefined);
    });
  });

  context.subscriptions.push(
    d1, d2, d3, d4
  );
}
