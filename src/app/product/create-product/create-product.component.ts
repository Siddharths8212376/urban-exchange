import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/authentication/auth.service';
import { CreateFields } from 'src/app/models/create-product-fields.model';
import { ImageService } from 'src/app/services/image/image.service';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { ProductService } from 'src/app/services/product/product.service';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.scss']
})
export class CreateProductComponent implements OnInit {
  productTag: string | null = '';
  createFields: CreateFields[] = [];
  productForm: FormGroup | any = null;
  inputFileList: FileList | any;
  previews: string[] = [];
  uploadedFiles: FileList | any = [];
  constructor(
    private productService: ProductService,
    private fb: FormBuilder,
    private imageService: ImageService,
    private router: Router,
    private authService: AuthService,
    public loader: LoaderService,
  ) { }
  ngOnInit(): void {
    this.generateProductTag();
    this.getCreateFields();
  }
  get attrs() {
    return this.productForm?.controls['attrs'] as FormArray;
  }
  getCreateFields() {
    this.productService.getProductCreateFields().subscribe(response => {
      this.createFields = response.data;
      this.buildProductForm();
    });
  }
  generateProductTag() {
    // TODO: if required to persist form data, we need a way to persist product tag
    // Reminder: Do not delete
    // if (sessionStorage.getItem('productTag')) {
    //   this.productTag = sessionStorage.getItem('productTag');
    // } else {
    this.productService.getProductTag().subscribe(response => {
      this.productTag = response.data;
      sessionStorage.setItem('productTag', this.productTag);
    });
    // }
  }
  buildProductForm() {
    this.productForm = this.fb.group({
      attrs: this.fb.array([]),
    })
    this.setFormControlData();
  }
  getProps(field: CreateFields, subCatLevel?: number) {
    let props: any = {
      value: '',
      fieldName: field.fieldName,
      label: field.label,
      type: field.type,
      multiple: field.multiple,
      required: field.required,
      options: [[]],
      metadata: [[]],
      subCatLevel: subCatLevel ? subCatLevel : 0
    };
    if (field.required) {
      if (['text', 'textarea'].includes(field.type)) {
        props.value = [null, Validators.compose([Validators.required, Validators.minLength(1)])];
      } else if (field.type == 'number') {
        props.value = [null, Validators.compose([Validators.required, Validators.min(1)])];
      } else {
        props.value = [null, Validators.required]
      }
    }
    if (field.type == 'select' || field.type == 'autocomplete') {
      props.options = [field.options];
      if (field.type == 'autocomplete') {
        props.displayOptions = [field.options];
      }
    }
    return props;
  }
  setFormControlData() {
    this.createFields.forEach(field => {
      const ctl = this.fb.group({ ...this.getProps(field) });
      this.attrs.push(ctl);
    })
  }
  onFileSelected(attribute: any) {
    const inputNode: any = document.querySelector('#file');
    this.inputFileList = inputNode.files;
    if (this.inputFileList && this.inputFileList.length > 0) {
      for (let i = 0; i < this.inputFileList.length; i++) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.previews.push(e.target.result);
        }
        reader.readAsDataURL(this.inputFileList[i]);
        this.uploadedFiles.push(this.inputFileList[i]);
      }
      attribute.get('value').patchValue(true);
    }
  }
  addSubCategory(fields: CreateFields[], fieldName: string, subCatLevel: number) {
    let categoryField = fields.find(field => field.fieldName == 'Category');
    let subCategory = null;
    if (subCatLevel == 1) {
      subCategory = categoryField?.metadata?.find(m => m.category == fieldName);
    }
    else if (subCatLevel == 2) {
      let subCatL1 = this.attrs.value.find((v: any) => v.fieldName == 'Category').value;
      subCategory = categoryField?.metadata?.find(m => m.category == subCatL1)?.fields.find(f => f.fieldName == 'Category')?.metadata?.find(m => m.category == fieldName);
    }

    let subCatFields = subCategory?.fields;
    let subCatIdxPrev: number[] = [];
    this.attrs.controls.forEach((control, index) => {
      if (control.value.subCatLevel >= subCatLevel) {
        subCatIdxPrev.push(index);
      }
    });
    subCatIdxPrev.reverse().forEach((index) => {
      this.attrs.removeAt(index);
    });
    subCatFields?.forEach(field => {
      const ctl = this.fb.group({ ...this.getProps(field, subCatLevel) });
      this.attrs.push(ctl);
    })
  }
  onChangeOfData(attribute: any, $event: any) {
    attribute.get('value').patchValue($event);
    if (attribute.value.type == 'autocomplete') {
      attribute.value.displayOptions = attribute.value.options.filter((opt: string) => opt[0].toLowerCase().includes($event.toLowerCase()));
    }
    if (attribute.value.fieldName == 'Category') {
      this.addSubCategory(this.createFields, attribute.value.value, attribute.value.subCatLevel + 1);
    }
  }
  removeImageFromPreview(idx: number) {
    this.previews.splice(idx, 1);
  }
  onSumbit() {
    let createPayload: any = {
      tag: this.productTag,
      seller: this.authService.getCurrentUser()._id,
    };
    this.productForm.value['attrs'].map((attr: any) => {
      createPayload[`${attr.label}`] = attr.value;
    });
    this.imageService.uploadImages(this.uploadedFiles, this.productTag as string).subscribe(response => {
      this.productService.createProduct(createPayload).subscribe(createResponse => {
        sessionStorage.removeItem('tag');
        this.router.navigate(["/home"]);
      })
    })
  }
}
