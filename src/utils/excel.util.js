import ExcelJS from 'exceljs';

export async function createAllClientReport(data) {
    const workbook = new ExcelJS.Workbook();

    const worksheet = workbook.addWorksheet('Lista klientów');

    worksheet.columns = [
        { header: 'Typ'                             , key: 'company_type', width: 40 },
        { header: 'Nazwa firmy'                     , key: 'company_name', width: 45 },
        { header: 'Właściciel'                      , key: 'owner_company', width: 30 },
        { header: 'NIP'                             , key: 'nip', width: 15 },
        { header: 'REGON'                           , key: 'regon', width: 15 },
        { header: 'KRS'                             , key: 'krs', width: 15 },
        { header: 'PESEL'                           , key: 'pesel', width: 15 },
        { header: 'Email'                           , key: 'email', width: 35 },
        { header: 'Telefon'                         , key: 'phone', width: 15 },
        { header: 'Płatnik VAT'                     , key: 'is_vat_payer', width: 15 },
        { header: 'Status współpracy'               , key: 'cooperation_status', width: 25 },
        { header: 'Opiekun klienta'                 , key: 'account_manager', width: 30 },
        { header: 'Uwagi dotyczące klienta'         , key: 'notes', width: 50 },
        { header: 'Data dodania klienta do systemu' , key: 'created_at', width: 32 },
        { header: 'Ost. data modyfi. danych klienta', key: 'updated_at', width: 32 },
    ];

    worksheet.addRows(data);

    const headerRow = worksheet.getRow(1);

    headerRow.font = {
        bold: true,
        color: {
            argb: 'FFFFFFFF'
        }
    };

    headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {
            argb: 'FF1E3A5F'
        }
    };

    headerRow.alignment = {
        vertical: 'middle',
        horizontal: 'center'
    };

    headerRow.height = 25;

    return await workbook.xlsx.writeBuffer();
}

export async function createAllTasksReport(data) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Lista wszystkich zadań');

    worksheet.columns = [
        { header: 'Zadanie przypisane do'    , key: 'user'       , width: 30 },
        { header: 'Zadanie powiązane z'      , key: 'client'     , width: 45 },
        { header: 'Opis zadania'             , key: 'description', width: 70 },
        { header: 'Termin wykonania'         , key: 'due_date'   , width: 30 },
        { header: 'Priorytet'                , key: 'priority'   , width: 20 },
        { header: 'Czy aktywne zadanie'      , key: 'is_active'  , width: 20 },
        { header: 'Czy zakończone zadanie'   , key: 'is_complete', width: 20 },
        { header: 'Data utworzenia zadania'  , key: 'created_at' , width: 32 },
        { header: 'Data ost. modyfi. zadania', key: 'updated_at' , width: 32 },
    ];

    worksheet.addRows(data);

    const headerRow = worksheet.getRow(1);

    headerRow.font = {
        bold: true,
        color: {
            argb: 'FFFFFFFF'
        }
    }

    headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {
            argb: 'FF1E3A5F'
        }
    };

    headerRow.alignment = {
        vertical: 'middle',
        horizontal: 'center'
    };

    headerRow.height = 25;

    return await workbook.xlsx.writeBuffer();
}