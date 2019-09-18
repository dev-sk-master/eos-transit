import React from 'react';
import WAL, { DiscoveryData, WalletProvider } from 'eos-transit';
import { NoContent } from '../shared/NoContent';
import { WalletList } from '../shared/wallets/WalletList';
import { ConnectSettings } from '../shared/providers/ProviderTypes'

const { accessContext } = WAL;

export interface AvailableWalletListProps {
	onItemSelect?: () => void;
}

export function AvailableWalletList({ onItemSelect }: AvailableWalletListProps) {
	accessContext.getWallets();
	const availableWalletProviders = accessContext.getWalletProviders();
	// d.filter((walletProvider) => !addedWallets.some((w) => w.provider.id === walletProvider.id));

	if (!availableWalletProviders.length) {
		return <NoContent message="No available wallet providers" />;
	}

	const handleWalletProviderSelect = (walletProvider: WalletProvider, connectSettings: ConnectSettings) => {
		// TODO: Implement in a cleaner way
		if (typeof onItemSelect === 'function') {
			onItemSelect();
		}
		const wallet = accessContext.initWallet(walletProvider);
		const start = window.performance.now();
		// @ts-ignore
		wallet.connect({}).then(() => {
			const end = window.performance.now();
			const time = end - start;
			console.log(time);
			wallet.discover({ pathIndexList: [0] }).then((discoveryData: DiscoveryData) => {
				console.log(discoveryData);
				// console.timeEnd('someFunction');

				if (discoveryData.keyToAccountMap.length > 0) {
					const index = 0;
					const keyObj = discoveryData.keyToAccountMap[index];

					const accountName = keyObj.accounts[0].account;
					const authorization = keyObj.accounts[0].authorization;

					wallet.login(accountName, authorization);
				} else {
					// 0 keys returned, we need to user to select an account
					wallet.login();
				}
			});
		});
	}

	return (
		<WalletList
			walletProviders={availableWalletProviders}
			onItemSelect={handleWalletProviderSelect}
		/>
	);
}

export default AvailableWalletList;
