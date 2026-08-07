import * as dictionaryRepository from '../repositories/dictionary.repository.js';

export async function getAll() {
    const dictionaries = await dictionaryRepository.getAll();
    const grouped = {};

    for(const dictionary of dictionaries) {
        if(!grouped[dictionary.dictionary_type]) {
            grouped[dictionary.dictionary_type] = [];
        }

        grouped[dictionary.dictionary_type].push({
            id: dictionary.id,
            value: dictionary.value_key,
            label: dictionary.display_name
        });
    }

    return grouped;
}