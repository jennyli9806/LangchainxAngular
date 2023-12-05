"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = void 0;
var text_splitter_1 = require("langchain/text_splitter");
var openai_1 = require("langchain/embeddings/openai");
var pinecone_1 = require("langchain/vectorstores/pinecone");
var pinecone_client_1 = require("src/utils/pinecone-client");
var pdf_1 = require("langchain/document_loaders/fs/pdf");
var pinecone_2 = require("src/config/pinecone");
var directory_1 = require("langchain/document_loaders/fs/directory");
/* Name of directory to retrieve your files from
   Make sure to add your PDF files inside the 'docs' folder
*/
var filePath = 'docs';
var run = function () { return __awaiter(void 0, void 0, void 0, function () {
    var directoryLoader, rawDocs, textSplitter, docs, embeddings, index, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                directoryLoader = new directory_1.DirectoryLoader(filePath, {
                    '.pdf': function (path) { return new pdf_1.PDFLoader(path); },
                });
                return [4 /*yield*/, directoryLoader.load()];
            case 1:
                rawDocs = _a.sent();
                textSplitter = new text_splitter_1.RecursiveCharacterTextSplitter({
                    chunkSize: 1000,
                    chunkOverlap: 200,
                });
                return [4 /*yield*/, textSplitter.splitDocuments(rawDocs)];
            case 2:
                docs = _a.sent();
                console.log('split docs', docs);
                console.log('creating vector store...');
                embeddings = new openai_1.OpenAIEmbeddings();
                index = pinecone_client_1.pinecone.Index(pinecone_2.PINECONE_INDEX_NAME);
                //embed the PDF documents
                return [4 /*yield*/, pinecone_1.PineconeStore.fromDocuments(docs, embeddings, {
                        pineconeIndex: index,
                        namespace: pinecone_2.PINECONE_NAME_SPACE,
                        textKey: 'text',
                    })];
            case 3:
                //embed the PDF documents
                _a.sent();
                return [3 /*break*/, 5];
            case 4:
                error_1 = _a.sent();
                console.log('error', error_1);
                throw new Error('Failed to ingest your data');
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.run = run;
(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, exports.run)()];
            case 1:
                _a.sent();
                console.log('ingestion complete');
                return [2 /*return*/];
        }
    });
}); })();
