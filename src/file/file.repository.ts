import {Repository} from "typeorm";
import {CustomRepository} from "../board/typeorm-custom.decorator";
import {VocaFile} from "./file.entity";


@CustomRepository(VocaFile)
export class VocaFileRepository extends Repository<VocaFile> {
}