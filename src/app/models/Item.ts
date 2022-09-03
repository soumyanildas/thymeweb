export interface Inventory {
  readonly id: string;
  readonly departmentId: string;
  readonly itemname: string;
  itemprice: number;
  readonly isTaxable: boolean;
  readonly imgUrl: string;
  readonly desc?: string;
  readonly itemSpcl?: boolean;
  readonly itemOnHH?: boolean;
  readonly itemhasMod?: boolean;
  specialInstructions?: string;
}

export interface ModifierGroupList {
  readonly id: string;
  readonly modifierGroupName: string;
  readonly deptID: string;
  maxItems: number;
  minItems: number;
  errorMessage: string;
  isValid: boolean;
  isMultiple: boolean;
  isDisabled: boolean;
  readonly position: number;
}

export interface ModifierList {
  readonly id: string;
  readonly modifier_name: string;
  readonly modifiersGroupId: string;
  isSelected: boolean;
  modifierPrice1: number;
}
export interface Modifier extends ModifierGroupList {
  modifierItems: ModifierList[];
}
export interface ItemModified extends Inventory {
  count: number;
  modifiers: Modifier[];
}

export class Item {
  readonly inventoryDTO!: Inventory;
  readonly modifierGroupList!: ModifierGroupList[];
  readonly modifierList!: ModifierList[];

  constructor(inventoryDTO: Inventory, modifierGroupList: ModifierGroupList[], modifierList: ModifierList[]) {
    this.inventoryDTO = inventoryDTO;
    this.modifierGroupList = modifierGroupList;
    this.modifierList = modifierList
  }

  modify(): ItemModified {
    this.inventoryDTO.itemprice = this.inventoryDTO.itemprice / 100;
    const item: ItemModified = {
      ...this.inventoryDTO,
      count: 0,
      modifiers: []
    };
    for (let i = 0; i < this.sortModifierGroupList(this.modifierGroupList).length; i += 1) {
      this.modifierGroupList[i].maxItems = this.modifierGroupList[i].maxItems / 100;
      this.modifierGroupList[i].minItems = this.modifierGroupList[i].minItems / 100;
      this.modifierGroupList[i].errorMessage = '';
      this.modifierGroupList[i].isValid = true;
      if (this.modifierGroupList[i].minItems <= this.modifierGroupList[i].maxItems) {
        this.modifierGroupList[i].isMultiple = true;
      } else {
        this.modifierGroupList[i].isMultiple = false;
      }
      this.modifierGroupList[i].isDisabled = false;
      item.modifiers[i] = {
        ...this.modifierGroupList[i],
        modifierItems: []
      };
      for (let j = 0; j < this.modifierList.length; j += 1) {
        if (this.modifierList[j].modifiersGroupId === this.modifierGroupList[i].id) {
          this.modifierList[j].isSelected = false;
          if (this.modifierList[j].modifierPrice1) {
            this.modifierList[j].modifierPrice1 = this.modifierList[j].modifierPrice1 / 100;
          } else {
            this.modifierList[j].modifierPrice1 = 0;
          }
          item.modifiers[i].modifierItems?.push(this.modifierList[j]);
        }
      }
    }
    return item;
  }

  sortModifierGroupList(modifierGroupList: ModifierGroupList[]): ModifierGroupList[] {
    return modifierGroupList.sort((prev: ModifierGroupList, next: ModifierGroupList) => prev.position > next.position ? -1 : 1);
  }

}
