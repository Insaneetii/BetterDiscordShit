//META{"name":"NoAFK","source":"","website":""}*//

class NoAFK {
	/* BD functions */
	getName () {
		return "No-AFK";
	}

	getVersion () {
		return "0.0.1";
	}

	getAuthor () {
		return "Hatsu";
	}

	getDescription () {
		return "Prevent Discord from setting your status to idle";
	}

	setData (key, value) {
		BdApi.setData(this.getName(), key, value);
	}

	getData (key) {
		return BdApi.getData(this.getName(), key);
	}

	/* Code related to Animations */
	load () {
		Status.authToken = this.getData("token");
	}

	start () {
		if (Status.authToken == undefined) return;
		this.Status_Animate();
	}

	stop () {
		clearTimeout(this.loop);
		Status.unset();
	}


	Status_Animate () {
		
		let results = "";
		Promise.all(results).then(res => {
			Status.set()
			this.loop = setTimeout(() => { this.Status_Animate(); }, 10000);
		});
	}

	/* Settings related functions */

	getSettingsPanel () {
		let settings = document.createElement("div");
		settings.style.padding = "10px";

		// Auth token
		settings.appendChild(GUI.newLabel("AuthToken (https://discordhelp.net/discord-token)"));
		let token = GUI.newInput();
		token.value = this.getData("token");
		settings.appendChild(token);


		// Save Button
		settings.appendChild(GUI.newDivider());
		let save = GUI.newButton("Save");
		save.onclick = () => {
			try {
				// Set Auth token
				this.setData("token", token.value);
			}
			catch (e) {
				BdApi.showToast(e, {type: "error"});
				return;
			}

			// Show Toast
			BdApi.showToast("Settings were saved!", {type: "success"});

			this.stop();
			this.load();
			this.start();
		};
		settings.appendChild(save);

		// End
		return settings;
	}
}

/* Status API */
const Status = {
	authToken: "",

	request: () => {
		let req = new XMLHttpRequest();
		req.open("PATCH", "/api/v6/users/@me/settings", true);
		req.setRequestHeader("authorization", Status.authToken);
		req.setRequestHeader("content-type", "application/json");
		return req;
	},

	set: () => {
		Status.request().send('{"status":"online"}');
	},

	unset: () => {
		Status.request().send('{"status":"invisible"}');
	}
};

/* GUI Wrapper */
const GUI = {
	newInput: () => {
		let input = document.createElement("input");
		input.className = "inputDefault-_djjkz input-cIJ7To";
		return input;
	},

	newLabel: (text) => {
		let label = document.createElement("h5");
		label.className = "h5-18_1nd";
		label.innerText = text;
		return label;
	},

	newDivider: () => {
		let divider = document.createElement("div");
		divider.style.paddingTop = "15px";
		return divider;
	},

	newTextarea: () => {
		let textarea = document.createElement("textarea");
		textarea.className = "input-cIJ7To scrollbarGhostHairline-1mSOM1";
		textarea.style.resize = "vertical";
		textarea.rows = 4;
		return textarea;
	},

	newButton: (text) => {
		let button = document.createElement("button");
		button.className = "button-38aScr lookFilled-1Gx00P colorBrand-3pXr91 sizeSmall-2cSMqn"; 
		button.innerText = text;
		return button;
	}
};
