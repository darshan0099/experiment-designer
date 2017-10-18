from uuid import uuid4

import csv
import tempfile
import re

from contextlib import contextmanager


def unique_upload_id():
    return str(uuid4())


def snakify_keys(dictionary):
    return dict((to_snake_case(key), value) for key, value in dictionary.items())


def to_snake_case(name):
    s1 = re.sub('(.)([A-Z][a-z]+)', r'\1_\2', name)
    return re.sub('([a-z0-9])([A-Z])', r'\1_\2', s1).lower()

@contextmanager
def makeNamedTemporaryCSV(content, separator='|'):
    tf = tempfile.NamedTemporaryFile(delete=False)
    with open(tf.name, 'w') as write_stream:
        writer = csv.writer(write_stream, delimiter=separator)
        for row in content:
            writer.writerow(row)

    yield tf.name

    tf.close()
