"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload_configuration = exports.getEndpoint = exports.get_configuration = void 0;
const exec_1 = require("@actions/exec");
const core = __importStar(require("@actions/core"));
const auth = __importStar(require("@actions/http-client/lib/auth"));
const httpm = __importStar(require("@actions/http-client"));
function get_configuration(args, name) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let compose_configuration = '';
            const options = { silent: true };
            options.listeners = {
                stdout: (data) => {
                    compose_configuration += data.toString();
                },
            };
            try {
                yield (0, exec_1.exec)('docker', ['compose', '-p', name].concat(args, ['config']), options);
            }
            catch (error) {
                core.error(`Compose Configuration Failure: ${compose_configuration}`);
                throw error;
            }
            return compose_configuration;
        }
        catch (error) {
            if (error instanceof Error)
                core.setFailed(error.message);
            throw error;
        }
    });
}
exports.get_configuration = get_configuration;
function getEndpoint(project) {
    var base = core.getInput('url');
    if (base.endsWith('/')) {
        base = base.slice(0, -1);
    }
    return `${base}/api/v1/project/${project}/configuration`;
}
exports.getEndpoint = getEndpoint;
function upload_configuration(project, configuration) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const token = core.getInput('token');
        const endpoint = getEndpoint(project);
        const bearer = new auth.BearerCredentialHandler(token);
        const http = new httpm.HttpClient('linode-sokka-github-actions-deploy', [
            bearer
        ]);
        const response = yield http.post(endpoint, configuration);
        let statusCode = (_a = response.message.statusCode) !== null && _a !== void 0 ? _a : 0;
        if (!(statusCode >= 200 && statusCode < 300)) {
            core.setFailed(`Failed to upload configuration: ${response.message.statusMessage}`);
        }
    });
}
exports.upload_configuration = upload_configuration;
