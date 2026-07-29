import { forgeValthera, ValtheraClass } from "@wxn0brp/db-core";
import { IndexedDBActions } from "../src/indexed";

const results = document.querySelector("#results");

function log(msg: string, pass: boolean) {
	const div = document.createElement("div");
	div.textContent = `${pass ? "V" : "X"} ${msg}`;
	div.style.color = pass ? "green" : "red";
	results.appendChild(div);
	console.log(msg);
}

async function run() {
	let allPass = true;
	const test = async (name: string, fn: () => Promise<any>) => {
		try {
			await fn();
			log(name, true);
		} catch (err) {
			allPass = false;
			log(`${name}: ${err}`, false);
		}
	};

	const actions = new IndexedDBActions("smoke_test");

	globalThis.db = forgeValthera(new ValtheraClass({ adapter: actions as any }));

	await test("init", async () => {
		await actions.init();
	});

	await test("ensureCollection", async () => {
		await actions.ensureCollection("users");
	});

	await test("issetCollection", async () => {
		const exists = await actions.issetCollection("users");
		if (!exists) throw new Error("Collection should exist");
	});

	await test("getCollections", async () => {
		const collections = await actions.getCollections();
		if (!collections.includes("users")) throw new Error("users not found");
	});

	await test("add", async () => {
		await actions.add({ collection: "users", data: { _id: "1", name: "Alice" } });
	});

	await test("find", async () => {
		const found = await actions.find({ collection: "users", search: {} });
		if (found.length !== 1) throw new Error(`Expected 1, got ${found.length}`);
	});

	await test("findOne", async () => {
		const one = await actions.findOne({ collection: "users", search: { _id: "1" } });
		if (!one || one.name !== "Alice") throw new Error("Not found");
	});

	await test("update", async () => {
		const updated = await actions.update({
			collection: "users",
			search: { _id: "1" },
			updater: { name: "Bob" },
		});
		if (updated.length !== 1) throw new Error("Update failed");
	});

	await test("updateOne", async () => {
		const updatedOne = await actions.updateOne({
			collection: "users",
			search: { _id: "1" },
			updater: { name: "Charlie" },
		});
		if (!updatedOne || updatedOne.name !== "Charlie") throw new Error("UpdateOne failed");
	});

	await test("add second record", async () => {
		await actions.add({ collection: "users", data: { _id: "2", name: "Dave" } });
	});

	await test("remove", async () => {
		const removed = await actions.remove({ collection: "users", search: { _id: "2" } });
		if (removed.length !== 1) throw new Error("Remove failed");
	});

	await test("removeOne", async () => {
		const removedOne = await actions.removeOne({ collection: "users", search: { _id: "1" } });
		if (!removedOne) throw new Error("RemoveOne failed");
	});

	await test("removeCollection", async () => {
		await actions.removeCollection("users");
	});

	await test("close", async () => {
		await actions.close();
	});

	const summary = document.createElement("div");
	summary.textContent = allPass ? "All tests passed!" : "Some tests failed";
	summary.style.color = allPass ? "green" : "red";
	results.appendChild(summary);
}

run().catch((err) => {
	const div = document.createElement("div");
	div.textContent = `Fatal error: ${err}`;
	div.style.color = "red";
	results.appendChild(div);
});
