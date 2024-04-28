import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/authentication/auth.service';
import { CreateFields } from 'src/app/models/create-product-fields.model';
import { ImageService } from 'src/app/services/image/image.service';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { ProductService } from 'src/app/services/product/product.service';
import { HttpClient } from '@angular/common/http';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { HashtagService } from 'src/app/services/hashtag/hashtag.service';
import { HashTag } from 'src/app/models/hashtag.model';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.scss']
})
export class CreateProductComponent implements OnInit {
  productTag: string | null = '';
  createFields: CreateFields[] = [];
  productForm: FormGroup | any = null;
  pinCodeControl: FormControl | any;
  inputFileList: FileList | any;
  previews: string[] = [];
  uploadedFiles: FileList | any = [];
  stateAddedFlag: boolean = false;
  postalBaseUrl: string = 'https://api.postalpincode.in/pincode';
  hashtags: string[] = [];
  hashtag: string | null = null;
  displayAddHashtags: boolean = false;
  hashTextChanged: Subject<string> = new Subject<string>();
  hashSearchResults: HashTag[] = [];
  constructor(
    private productService: ProductService,
    private fb: FormBuilder,
    private imageService: ImageService,
    private router: Router,
    private authService: AuthService,
    public loader: LoaderService,
    private http: HttpClient,
    private hashTagService: HashtagService,
  ) { }
  ngOnInit(): void {
    this.generateProductTag();
    this.getCreateFields();
    this.setPinCodeValidators();
    this.hashTextChanged.pipe(
      debounceTime(300), distinctUntilChanged()
    ).subscribe(searchItem => {
      if (this.isValidHashTag(searchItem)) this.searchHashTags(searchItem);
    });
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
    // Add pin code validation
    if (field.fieldName === 'PIN') {
      props.value = [null, Validators.compose([Validators.required, Validators.pattern('^[0-9]{6}$')])];
    }
    return props;
  }
  setFormControlData() {
    this.createFields.forEach(field => {
      const ctl = this.fb.group({ ...this.getProps(field) });
      this.attrs.push(ctl);
    })
  }
  onChangeHashTag($event: any) {
    this.hashTextChanged.next($event);
  }

  isValidHashTag(value: string | null): boolean {
    if (value == null || value == undefined) return true;
    if (value.length == 0) return false;
    else {
      let v = value;
      v = v.trim();
      if (v.length == 0) return false;
      if (!v || v && v[0] !== '#' || v && v.includes(' ') || v && v[0] == '#' && v.length < 2) {
        return false;
      }
    }
    return true;
  }
  displayAddHashTag() {
    this.displayAddHashtags = true;
  }
  removeFromHashtags(hashtag: string, attribute: any) {
    this.hashtags = this.hashtags.filter(h => h !== hashtag);
    attribute.get('value').patchValue(this.hashtags);
  }
  addHashTag(hashtag: string | null) {
    if (this.isValidHashTag(hashtag) && !this.hashtags.find(ht => ht == hashtag) && hashtag !== null) this.hashtags.push(hashtag);
  }
  submitInfo(hashtag: string | null, attribute: any) {
    this.addHashTag(hashtag);
    this.hashtag = null;
    attribute.get('value').patchValue(this.hashtags);
    this.hashSearchResults = [];
    this.displayAddHashtags = false;
  }
  searchHashTags(hashtag: string) {
    // do some async op and return the search results
    // store into hashSearchResults
    this.hashTagService.searchHashTag(hashtag).subscribe(response => {
      this.hashSearchResults = response.data;
    })
  }
  setPinCodeValidators() {
    this.pinCodeControl = new FormControl({ value: '', disabled: true }, [
      Validators.required,
      Validators.pattern('^[0-9]{6}$')
    ]);
  }
  isStateFieldFilled(): boolean {
    let stateFields = this.productForm.get('attrs')['controls'].filter((control: any) => control.value.fieldName == 'State');
    return stateFields.length > 0 && (stateFields[0].value.value != null || stateFields[0].value.value != '');
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
      subCategory = categoryField?.metadata?.find(m => m.category == subCatL1)?.fields.find(f => f.label == 'subCategory')?.metadata?.find(m => m.category == fieldName);
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
      this.attrs.insert(this.attrs.length - 7, ctl);
    })
  }
  async onChangeOfData(attribute: any, $event: any) {
    attribute.get('value').patchValue($event);
    if (attribute.value.type == 'autocomplete') {
      if (attribute.value.label == 'state') {
        attribute.value.displayOptions = attribute.value.options.filter((opt: string) => opt[0].toLowerCase().includes($event.toLowerCase()));
      } else {
        attribute.value.displayOptions = attribute.value.options.filter((opt: string) => opt.toLowerCase().includes($event.toLowerCase()));
      }
    }
    if (['category', 'subCategory'].includes(attribute.value.label)) {
      this.addSubCategory(this.createFields, attribute.value.value, attribute.value.subCatLevel + 1);
    }

    if (attribute.value.fieldName == 'State') {
      if (attribute.value.value != null && attribute.value.value != '')
        this.stateAddedFlag = true;
      else {
        this.stateAddedFlag = false;
        let pinField = this.productForm.get('attrs')['controls'].filter((cntrl: any) => cntrl.value.fieldName == 'PIN');
        pinField[0].get('value').patchValue(null); // Reset pin code
      }
    }
    this.checkIfPinCodeIsDisabled();

    if (attribute.value.fieldName == 'PIN' && !this.pinCodeControl.hasError('pattern') && attribute.value.value !== null) {
      attribute = await this.validateIfPinCodeMatchesState(attribute);
    }
  }
  checkIfPinCodeIsDisabled() {
    if (this.stateAddedFlag) {
      this.pinCodeControl.enable();
    } else {
      this.pinCodeControl.disable();
    }
  }
  validateIfPinCodeMatchesState(attribute: any) {
    return new Promise((resolve, reject) => {
      this.loader.start();
      this.productService.validatePinCode(attribute.value.value).subscribe(res => {
        if(res && res.status == 'success') {
          let response = res.data;
          if (response && response.length > 0 && response[0].Status == 'Success') {
            let stateFields = this.productForm.get('attrs')['controls'].filter((cntrl: any) => cntrl.value.fieldName == 'State');
            if(response[0].PostOffice && response[0].PostOffice.length > 0 && response[0].PostOffice[0].State !== stateFields[0].value.value) {
              this.pinCodeControl.setErrors({ invalid: true }); // Set error for pin code
              attribute.setErrors({ invalid: true }); // Set error in the form so that submit button is disabled
              this.loader.stop();
              resolve(attribute);
            }
            this.loader.stop();
          } else {
            this.pinCodeControl.setErrors({ invalid: true });
            attribute.setErrors({ invalid: true });
            this.loader.stop();
            resolve(attribute);
          }
        }
      });
    });
  }
  removeImageFromPreview(idx: number) {
    this.previews.splice(idx, 1);
  }
  preventNegativeInput(event: any): void {
    if (event.key === '-') {
      event.preventDefault();
    }
  }
  onSumbit() {
    let createPayload: any = {
      tag: this.productTag,
      seller: this.authService.getCurrentUser()._id,
      metadata: {}
    };
    this.productForm.value['attrs'].map((attr: any) => {
      if (attr.subCatLevel > 0) {
        createPayload['metadata'][`${attr.label}`] = attr.value;
      } else {
        createPayload[`${attr.label}`] = attr.value;
      }
    });
    this.imageService.uploadImages(this.uploadedFiles, this.productTag as string).subscribe(response => {
      this.productService.createProduct(createPayload).subscribe(createResponse => {
        sessionStorage.removeItem('tag');
        this.router.navigate(["/home"]);
      })
    })
  }
}
