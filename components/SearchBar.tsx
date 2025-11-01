import { icons } from '@/constants/icons';
import React from 'react';
import { Image, TextInput, TouchableOpacity, View } from 'react-native';

// the ones with the ? are optional properties
interface Props {
    placeholder: string;
    onPress?: () => void;
    value?: string;
    onChangeText: (text: string) => void;
}

const SearchBar = ({ placeholder, onPress, value, onChangeText }: Props) => {
    return (
        <View className="flex-row items-center bg-white/10 rounded-2xl px-5 py-4 border border-white/20 backdrop-blur-lg">
            <Image 
                source={icons.search} 
                className='size-6' 
                resizeMode='contain' 
                tintColor="#8b5cf6" 
            />
            <TextInput
                placeholder={placeholder}
                value={value}
                onChangeText={onChangeText}
                placeholderTextColor="#A0A0A0"
                className='flex-1 ml-3 text-white text-lg font-medium tracking-wide'
                autoFocus={true}
                returnKeyType="search"
                clearButtonMode="while-editing"
            />
            {value && value.length > 0 && (
                <TouchableOpacity onPress={() => onChangeText('')}>
                    <Image 
                        source = {icons.arrow} 
                        className='size-5' 
                        resizeMode='contain' 
                        tintColor="#A0A0A0"
                    />
                </TouchableOpacity>
            )}
        </View>
    )
}

export default SearchBar;